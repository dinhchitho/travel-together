import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { useChatContext } from "stream-chat-expo";
import UserListItem from "./UserListItem";

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { client } = useChatContext();

  const fetchUsers = async () => {
    setIsLoading(true);
    const response = await client.queryUsers({});
    setUsers(response.users);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [users]);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserListItem userDetail={item} />}
        refreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
});