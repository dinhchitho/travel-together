import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Color from '../../../utilites/Color';
import { globalStyles } from '../../../globalStyles';
import { headerStyles } from '../../../components/HeaderCommon/HeaderCommon';
import { BottomSheetRefProps } from '../../../components/custom/BottomModal';
import { WINDOW_HEGIHT } from '../../../utilites/Dimensions';

const GroupBlog = () => {

    const navigation = useNavigation<any>();

    const route = useRoute();
    const params = route.params;

    const [follows, setFollows] = useState<[]>([]);

    return (
        <SafeAreaView>
            <View style={[headerStyles.header, globalStyles.px15]}>
                <TouchableOpacity
                    style={{ width: 50, alignItems: "flex-start" }}
                >
                    {/* <Feather name="arrow-left" size={24} color="black" /> */}
                </TouchableOpacity>
                <Text style={headerStyles.headerText}>Haha</Text>
                <View style={{ width: 50 }}></View>
            </View>
            <View style={{ padding: 15 }}>
                <View style={followStyles.tabWrapper}>
                    <TouchableOpacity
                    >
                        <Text style={{ fontSize: 15, fontWeight: "500" }}>Follower</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: "500",
                            }}
                        >
                            Following
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: 10 }}>
                    {/* {follows &&
              follows.map((item: any) => (
                // <FollowUser
                //   key={item.id}
                //   userId={item.id}
                //   avatar={item.avatar}
                //   fullName={item.fullName}
                //   onUnfollow={handleUnfollow}
                //   onAddFollow={handleAddFollow}
                //   // isFollowing={checkUserInFollowing(item.id)}
                // />
              ))} */}
                </View>
            </View>
        </SafeAreaView>
    );
};


export default GroupBlog

const followStyles = StyleSheet.create({
    tabWrapper: {
        height: 40,
        backgroundColor: "#ECEDEE",
        borderRadius: 6,
        padding: 2,
        flexDirection: "row",
    },
    tab: {
        height: "100%",
        borderRadius: 4,
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
    },
    avatarWrapper: {
        borderColor: Color.white,
        borderWidth: 3,
        borderRadius: 100,
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 100,
    },
    itemWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
    },
    itemBtnFollow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    unfollowBtn: {
        backgroundColor: Color.white,
        borderWidth: 1,
        borderColor: Color.grey,
        borderRadius: 2,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignSelf: "flex-start",
    },
    followBtn: {
        backgroundColor: Color.primary,
        borderRadius: 2,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignSelf: "flex-start",
    },
    followBtnText: {
        fontWeight: "bold",
        color: Color.white,
    },
    onUnfollowBtntext: {
        fontWeight: "bold",
        color: Color.primary,
    },
});