package com.traveltogether.configservice.service.impl;

import com.traveltogether.configservice.config.security.jwt.JwtUtils;
import com.traveltogether.configservice.config.security.service.impl.UserDetailsImpl;
import com.traveltogether.configservice.config.security.service.impl.UserDetailsServiceImpl;
import com.traveltogether.configservice.constanst.Constant;
import com.traveltogether.configservice.converter.ConvertDTOToDocument;
import com.traveltogether.configservice.document.*;
import com.traveltogether.configservice.dto.*;
import com.traveltogether.configservice.model.ERole;
import com.traveltogether.configservice.model.ETypeNotify;
import com.traveltogether.configservice.payload.request.LoginExternalRequest;
import com.traveltogether.configservice.payload.request.LoginRequest;
import com.traveltogether.configservice.payload.request.SignupRequest;
import com.traveltogether.configservice.payload.response.JwtResponse;
import com.traveltogether.configservice.payload.response.MessageResponse;
import com.traveltogether.configservice.repository.IRoleRepository;
import com.traveltogether.configservice.repository.IUserRepository;
import com.traveltogether.configservice.repository.UserDetailRepository;
import com.traveltogether.configservice.service.IBlogService;
import com.traveltogether.configservice.service.IReportService;
import com.traveltogether.configservice.service.IUserService;
import com.traveltogether.configservice.synchronize.CustomEventPublisher;
import com.twilio.Twilio;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.twilio.rest.api.v2010.account.ValidationRequest;
import com.twilio.base.ResourceSet;
import com.twilio.rest.api.v2010.account.OutgoingCallerId;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IBlogService blogService;

    @Autowired
    private IReportService iReportService;

    @Autowired
    private UserDetailsServiceImpl detailsServiceImpl;

    @Autowired
    private MongoOperations mongoOperations;

    @Autowired
    private CustomEventPublisher customEventPublisher;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private IRoleRepository roleRepository;

    private static final Logger logger = LoggerFactory.getLogger(TravelRequestImpl.class);

    @Value("${twilio.account_sid}")
    private String TWILIO_ACCOUNT_SID;

    @Value("${twilio.auth_token}")
    private String TWILIO_AUTH_TOKEN;

    @Value("${twilio.trial_number}")
    private String TWILIO_PHONE;

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles);
    }

    @Override
    public JwtResponse authenticateUserExternal(LoginExternalRequest loginRequest) throws Exception {
        if (userDetailRepository.existsByUsername(loginRequest.getUsername())) {
            // user name at login request is a string generation id
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getUsername()));
            String jwt = jwtUtils.generateJwtToken(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles);
        } else {
            // Create new user's account
            User user = new User(loginRequest.getUsername(),
                    loginRequest.getEmail(),
                    encoder.encode(loginRequest.getUsername()), loginRequest.getPhone(), loginRequest.getFullName());

            user.setAvatar(loginRequest.getImageAvatar());

            Set<Role> roles = new HashSet<>();

            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            user.setRoles(roles);
            userRepository.save(user);
            // login
            // user name at login request is a string generation id
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getUsername()));
            String jwt = jwtUtils.generateJwtToken(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roleUser = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());
            return new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roleUser);
        }

    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public User registerUser(SignupRequest signupRequest) throws Exception {
        if (userDetailRepository.existsByUsername(signupRequest.getUsername())) {
            throw new Exception("Error: Username is already taken!");
        }
        if (userDetailRepository.existsByEmail(signupRequest.getEmail())) {
            throw new Exception("Error: Email is already in use!");
        }
        if (checkPhoneRegister(signupRequest.getPhone()) != null) {
            throw new Exception("Error: Phone is already in use!");
        }

        // Create new user's account
        User user = new User(signupRequest.getUsername(),
                signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()), signupRequest.getPhone(), signupRequest.getFullName());

        Set<Role> roles = new HashSet<>();

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        Role admin = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Role localguild = roleRepository.findByName(ERole.ROLE_LOCAL_GUILD)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        roles.add(userRole);
        // user.setAds(new ArrayList<>());
//        roles.add(admin);
//        roles.add(localguild);
        user.setRoles(roles);

        userRepository.save(user);

        return user;
    }

    @Override
    public String sendOptSms(String phone) throws Exception {
        // TODO Auto-generated method stub
        // check phone
        User user = checkPhone(phone);
        // Random rnd = new Random();
        // int number = rnd.nextInt(999999);
        // Twilio.init(TWILIO_ACCOUNT_SID ,TWILIO_AUTH_TOKEN);
        // // validate
        // ValidationRequest validationRequest = ValidationRequest.creator(
        // new com.twilio.type.PhoneNumber("+14158675310"))
        // .setFriendlyName("My Home Phone Number")
        // .create();

        // System.out.println("1" + validationRequest.getFriendlyName());
        // Message.creator(new PhoneNumber(user.getPhone()),
        // new PhoneNumber(TWILIO_PHONE), String.valueOf(number)).create();
        // SendSMSDto sendSMSDto = new SendSMSDto();
        // sendSMSDto.setUserId(user.getId());
        // sendSMSDto.setOtp(String.valueOf(number));
        return user.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User changePassword(String userId, String newPassword) throws Exception {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(userId));
        Update update = new Update();
        update.set("password", encoder.encode(newPassword));
        return mongoOperations.findAndModify(query, update, User.class);
    }

    @Override
    public User getUserById(String userId) throws Exception {
        Query query = new Query();
        User user = mongoOperations.findOne(query.addCriteria(Criteria.where("id").is(userId)), User.class);
        if (user == null) {
            throw new Exception("User not found!");
        }
        for (User elUser : user.getFollowedUsers()) {
            elUser.setFollowedUsers(null);
            elUser.setFollowingUsers(null);
            elUser.setBlogs(null);
            elUser.setAds(null);
            elUser.setNotifications(null);
        }
        return user;
    }

    private User checkPhoneRegister(String phone) {
        Query query = new Query();
        return mongoOperations.findOne(
                query.addCriteria(
                        Criteria.where("phone").is(phone)),
                User.class);
    }

    @Override
    public User checkPhone(String phone) throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        List<User> user = mongoOperations.find(
                query.addCriteria(
                        Criteria.where("phone").is(phone)),
                User.class);
        if (user.size() == 0) {
            throw new Exception("User not found!");
        }
        return user.get(0);
    }

    @Override
    public User becomeLocalGuilde(ObjectIdentifyCardDTO identifyCard, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        User checkSave = null;
        if (user != null && identifyCard.getId() != null) {
            user.setIdentify_card_id(identifyCard.getId());
            user.setFullName(identifyCard.getName());
            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
            Date date1 = new SimpleDateFormat("dd/MM/yyyy").parse(identifyCard.getDob());
            String formatDob = formatter.format(date1);
            Date parseDobToDate = new SimpleDateFormat("dd/MM/yyyy").parse(formatDob);
            user.setDob(parseDobToDate);
            if (identifyCard.getType().equals("chip_front")) {
                boolean gender = Constant.NAM.equals(identifyCard.getSex());
                user.setGender(gender);
            }
            ConvertDTOToDocument convertDTOToDocument = new ConvertDTOToDocument();
            user.setAddress_entities(convertDTOToDocument.convertDtoToDocument(identifyCard.getAddress_entities()));
            user.setLocalGuide(true);
            user.setHasSubmitID(true);
            user.setAds(new ArrayList<>());
            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            Role localguild = roleRepository.findByName(ERole.ROLE_LOCAL_GUILD)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            roles.add(localguild);
            user.setRoles(roles);
            checkSave = mongoOperations.save(user);
        }
        return checkSave;
    }

    @Override
    public User checkUserLogging(Principal principal) throws Exception {
        // TODO Auto-generated method stub
        UserDetailsImpl user = (UserDetailsImpl) detailsServiceImpl.loadUserByUsername(principal.getName());
        if (user == null) {
            throw new Exception("User not found!");
        }
        User checkUser = getUserById(user.getId());
        if (checkUser.getBlackListedUsers() != null) {
            if (checkUser.getBlackListedUsers().size() > 0) {
                for (User item : checkUser.getBlackListedUsers()) {
                    item.setBlogs(null);
                    item.setFollowedUsers(null);
                    item.setFollowingUsers(null);
                    item.setAds(null);
                    item.setQas(null);
                    item.setBlackListedUsers(null);
                    item.setNotifications(null);
                }
            }
        }
        if (checkUser.getFollowedUsers() != null) {
            for (User item : checkUser.getFollowedUsers()) {
                item.setFollowedUsers(null);
                item.setFollowingUsers(null);
                item.setBlogs(null);
                item.setAds(null);
                item.setQas(null);
                item.setBlackListedUsers(null);
                item.setNotifications(null);
            }
        }
        if (checkUser.getFollowingUsers() != null) {
            for (User item : checkUser.getFollowingUsers()) {
                item.setFollowedUsers(null);
                item.setFollowingUsers(null);
                item.setBlogs(null);
                item.setAds(null);
                item.setQas(null);
                item.setBlackListedUsers(null);
                item.setNotifications(null);
            }
        }
        if (checkUser.getBlogs() != null) {
            for (Blog item : checkUser.getBlogs()) {
                if (item.getLikedUsers().size() > 0) {
                    for (User el : item.getLikedUsers()) {
                        el.setFollowedUsers(null);
                        el.setFollowingUsers(null);
                        el.setBlogs(null);
                        el.setAds(null);
                        el.setQas(null);
                        el.setBlackListedUsers(null);
                    }
                }
            }
        }
        return checkUser;
    }

    @Override
    public User updateUser(Principal principal, User user) throws Exception {
        // TODO Auto-generated method stub
        User checkUser = checkUserLogging(principal);
        User userIsValid = mongoOperations.findById(user.getId(), User.class);
        if (userIsValid == null) {
            logger.error("userId not found!");
            throw new Exception("userId not found!");
        }
        userIsValid.setAvatar(user.getAvatar());
        userIsValid.setCoverPhoto(user.getCoverPhoto());
        userIsValid.setFullName(user.getFullName());
        userIsValid.setGender(user.isGender());
        userIsValid.setMarried(user.isMarried());
        userIsValid.setHeight(user.getHeight());
        userIsValid.setWeight(user.getWeight());
        userIsValid.setDob(user.getDob());
        userIsValid.setCountry(user.getCountry());
        userIsValid.setInterests(user.getInterests());
        userIsValid.setBio(user.getBio());
        userIsValid.setHasUpdated(user.isHasUpdated());
        User userNew = mongoOperations.save(userIsValid);
        if (userNew.getTravelRequest() != null) {
            logger.info("Update user information successful!");
        }
        return userNew;
    }

    @Override
    public String addBlackLst(Principal principal, String userId) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        // find userId add black lst
        User getUserBlackLst = getUserById(userId);
        if (user.getBlackListedUsers() != null) {
            user.getBlackListedUsers().add(getUserBlackLst);
        } else {
            List<User> list = new ArrayList<>();
            list.add(getUserBlackLst);
            user.setBlackListedUsers(list);
        }
        User checkSave = mongoOperations.save(user);
        return checkSave != null ? "Add black list successfully!" : "Add fail!";
    }

    @Override
    public Report report(Principal principal, Report report) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        report.setFullName(user.getFullName());
        Report saveReport = mongoOperations.insert(report);
        if (saveReport != null) {
            if (user.getReports() != null) {
                user.getReports().add(saveReport);
            } else {
                List<Report> list = new ArrayList<>();
                list.add(saveReport);
                user.setReports(list);
            }
            mongoOperations.save(user);
            Notification notification = new Notification();
            notification.setContent(report.getDescription());
            notification.setPermalink(report.getReportId());
            notification.setType(ETypeNotify.USER);
            notification.setFullName(user.getFullName());
            notification.setCreateUser(user.getUsername());
            notification.setCreatedDate(new Date());
            notification.setLastModifiedUser(user.getUsername());
            notification.setUpdateDttm(new Date());
            Notification saveNotification = mongoOperations.insert(notification);
            List<User> lstAdmin = getAllRoleAdmin();
            if (lstAdmin.size() > 0) {
                for (User admin : lstAdmin) {
                    if (admin.getNotifications() != null && admin.getNotifications().size() > 0) {
                        admin.getNotifications().add(saveNotification);
                    } else if (admin.getNotifications() == null || admin.getNotifications().size() == 0) {
                        List<Notification> notifications = new ArrayList<>();
                        notifications.add(saveNotification);
                        admin.setNotifications(notifications);
                    }
                    mongoOperations.save(admin);
                }
            }
            ListNotificationEventAdmin listNotificationEventAdmin = new ListNotificationEventAdmin(this, "admin",
                    saveNotification);
            logger.info("save successfully!");
            customEventPublisher.publishCustomEventAdmin(listNotificationEventAdmin);
        }
        return saveReport;
    }

    @Override
    public String removeUserBlackLst(Principal principal, String userId) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        // find userId add black lst
        User checkSave = null;
        if (user.getBlackListedUsers() != null && user.getBlackListedUsers().size() > 0) {
            for (User obj : user.getBlackListedUsers()) {
                if (obj.getId().equals(userId)) {
                    user.getBlackListedUsers().remove(obj);
                    checkSave = mongoOperations.save(user);
                    break;
                }
            }
        }
        return checkSave != null ? "Remove " + userId + " black list successfully!" : "Remove fail!";
    }

    @Override
    public List<User> getAllBlackLst(Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        if (user.getBlackListedUsers() == null) {
            return new ArrayList<User>();
        }
        return user.getBlackListedUsers();
    }

    @Override
    public List<User> getAllFollowers(Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        if (user.getFollowedUsers() == null) {
            return new ArrayList<User>();
        }
        return user.getFollowedUsers();
    }

    @Override
    public List<User> getAllFollowing(Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        if (user.getFollowingUsers() == null) {
            return new ArrayList<User>();
        }
        return user.getFollowingUsers();
    }

    @Override
    public String addFollowing(Principal principal, String userIdFollow) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        // find userId add follow
        User userFollow = getUserById(userIdFollow);
        User checkSaveFollowing = null;
        List<User> lstAddNewFollow = new ArrayList<>();
        boolean checkIsFollow = false;
        if (user.getFollowingUsers() != null) {
            for (User userIsFollow : user.getFollowingUsers()) {
                if (userIsFollow.getId().equals(userIdFollow)) {
                    throw new Exception("Already follow this user!");
                }
            }
            checkIsFollow = true;
        } else {
            List<User> list = new ArrayList<>();
            list.add(userFollow);
            user.setFollowingUsers(list);
        }
        // if (lstAddNewFollow.size() > 0) {
        // for (User userNew:
        // lstAddNewFollow) {
        // user.getFollowingUsers().add(userNew);
        // }
        // }
        if (checkIsFollow)
            user.getFollowingUsers().add(userFollow);
        checkSaveFollowing = mongoOperations.save(user);
        User checkSaveFollower = addFollower(user.getId(), userIdFollow);
        if (checkSaveFollowing != null && checkSaveFollower != null) {
            // create notification
            Notification notification = new Notification();
            notification.setContent(" a has followed you!");
            notification.setThumbnail(checkSaveFollowing.getAvatar());
            notification.setPermalink(checkSaveFollowing.getId());
            notification.setType(ETypeNotify.USER);
            notification.setFullName(checkSaveFollowing.getFullName());
            notification.setCreateUser(checkSaveFollower.getUsername());
            notification.setCreatedDate(new Date());
            notification.setLastModifiedUser(checkSaveFollower.getUsername());
            notification.setUpdateDttm(new Date());
            Notification checkSaveNotify = mongoOperations.insert(notification);
            // check lst notification user
            if (checkSaveFollower.getNotifications() != null) {
                user.getNotifications().add(checkSaveNotify);
            } else if (user.getNotifications() == null) {
                List<Notification> notificationList = new ArrayList<>();
                notificationList.add(checkSaveNotify);
                user.setNotifications((notificationList));
            }
            mongoOperations.save(user);
            // publish notification to socket
            ListNotificationEvent listNotificationEvent = new ListNotificationEvent(this, checkSaveFollower.getId(),
                    notification);
            logger.info("save successfully!");
            customEventPublisher.publishCustomEvent(listNotificationEvent);
        }
        return (checkSaveFollowing != null && checkSaveFollower != null) ? "Add User following successfully!"
                : "Add fail!";
    }

    @Override
    public String deleteFollowing(Principal principal, String userIdFollow) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        // find userId add follow
        User userFollow = getUserById(userIdFollow);
        User checkSaveFollowing = null;
        // check following
        if (user.getFollowingUsers() != null && user.getFollowingUsers().size() > 0) {
            for (User obj : user.getFollowingUsers()) {
                if (obj.getId().equals(userIdFollow)) {
                    user.getFollowingUsers().remove(obj);
                    checkSaveFollowing = mongoOperations.save(user);
                    break;
                }
            }
        }
        User checkSaveFollower = deleteFollower(user.getId(), userIdFollow);
        return (checkSaveFollowing != null && checkSaveFollower != null)
                ? "Remove " + userIdFollow + " follow successfully!"
                : "Remove fail!";
    }

    private User addFollower(String userFollowingId, String userFollowedId) throws Exception {
        // TODO Auto-generated method stub
        User userFollowing = getUserById(userFollowingId);
        User userFollowed = getUserById(userFollowedId);
        if (userFollowed.getFollowedUsers() != null) {
            userFollowed.getFollowedUsers().add(userFollowing);
        } else {
            List<User> list = new ArrayList<>();
            list.add(userFollowing);
            userFollowed.setFollowedUsers(list);
        }
        return mongoOperations.save(userFollowed);
    }

    private User deleteFollower(String userFollowingId, String userFollowedId) throws Exception {
        // TODO Auto-generated method stub
        // check follower
        User userFollowing = getUserById(userFollowingId);
        User userFollowed = getUserById(userFollowedId);
        User checkSaveFollower = null;
        if (userFollowed.getFollowedUsers() != null && userFollowed.getFollowedUsers().size() > 0) {
            for (User obj : userFollowed.getFollowedUsers()) {
                if (obj.getId().equals(userFollowing.getId())) {
                    userFollowed.getFollowedUsers().remove(obj);
                    checkSaveFollower = mongoOperations.save(userFollowed);
                    break;
                }
            }
        }
        return checkSaveFollower;
    }

    @Override
    public List<User> getAllUser() {
        // TODO Auto-generated method stub
        List<User> userLst = mongoOperations.findAll(User.class);
        for (User item : userLst) {
            item.setNotifications(null);
            item.setFollowedUsers(null);
            item.setFollowingUsers(null);
            // item.setBlogs(null);
            for (Blog blog : item.getBlogs()) {
                for (User liked : blog.getLikedUsers()) {
                    liked.setNotifications(null);
                    liked.setFollowedUsers(null);
                    liked.setFollowingUsers(null);
                    liked.setBlogs(null);
                    liked.setAds(null);
                    liked.setQas(null);
                    liked.setBlackListedUsers(null);
                    liked.setNotifications(null);
                }
            }
            item.setAds(null);
            item.setQas(null);
            item.setBlackListedUsers(null);
            item.setNotifications(null);
        }
        return userLst;
    }

    @Override
    public List<User> deleteUser(String userId) throws Exception {
        // TODO Auto-generated method stub
        User user = getUserById(userId);
        mongoOperations.remove(user);
        return getAllUser();
    }

    @Override
    public List<User> getAllRoleAdmin() throws Exception {
        // TODO Auto-generated method stub
        Query query = new Query();
        Role admin = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        query.addCriteria(Criteria.where("roles").elemMatch(Criteria.where("name").is(admin.getName())));
        List<User> user = mongoOperations.find(query, User.class);
        return user;
    }

    @Override
    public String banAcc(String idReport, String userId) throws Exception {
        // TODO Auto-generated method stub
        User checkAccBan = getUserById(userId);
        checkAccBan.setDisable(true);
        Report report = iReportService.getById(idReport);
        report.setBan(true);
        Report checkSave = mongoOperations.save(report);

        return ((mongoOperations.save(checkAccBan) != null) && (checkSave != null)) ? "Ban acc successfully!" : "Ban acc failed!";
    }

    @Override
    public String changePasswordUser(String oldPassword, String newPassword, Principal principal) throws Exception {
        // TODO Auto-generated method stub
        User user = checkUserLogging(principal);
        User checkSaveUser = null;
        if (encoder.matches(oldPassword, user.getPassword())) {
            logger.info("Password dung!");
            user.setPassword(encoder.encode(newPassword));
            checkSaveUser = mongoOperations.save(user);
        } else {
            logger.error("Old password wrong!");
            throw new Exception("Old password wrong!");
        }
        return (checkSaveUser != null) ? "Change password successfully!" : "Change password failed!";
    }

    @Override
    public List<Report> getAllReport() {
        // TODO Auto-generated method stub
        List<Report> reports = mongoOperations.findAll(Report.class);
        return reports;
    }

    @Override
    public Boolean updateNotify(String notifyId, Principal principal) throws Exception {
        User user = checkUserLogging(principal);
        Query query = new Query();
        User checkSaveUser = null;
        Notification checkId = mongoOperations.findOne(query.addCriteria(Criteria.where("id").is(notifyId)),
                Notification.class);
        if (checkId == null) {
            throw new Exception("Notification not found!");
        }
        for (Notification notification : user.getNotifications()) {
            if (notification.getId().equals(checkId.getId())) {
                notification.setRead(true);
                checkSaveUser = mongoOperations.save(user);
                break;
            }
        }
        return checkSaveUser != null;
    }

    @Override
    public Total total() {
        List<User> users = mongoOperations.findAll(User.class);
        List<TravelRequest> travelRequests = mongoOperations.findAll(TravelRequest.class);
        List<Report> reports = mongoOperations.findAll(Report.class);
        List<QA> qas = mongoOperations.findAll(QA.class);
        List<Blog> blogs = mongoOperations.findAll(Blog.class);
        List<Ads> ads = mongoOperations.findAll(Ads.class);
        Total total = new Total();
        total.setTotalQa(qas.size());
        total.setTotalUser(users.size());
        total.setTotalAds(ads.size());
        total.setTotalBLog(blogs.size());
        total.setTotalReport(reports.size());
        total.setTotalTravel(travelRequests.size());
        return total;
    }

}
