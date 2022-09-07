import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ItemNotification from './ItemNotification';
import HeaderCommon from '../../components/HeaderCommon/HeaderCommon';
import { ApplicationState } from '../../redux';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

interface IProps {
  lstNotification: any[],
}

const NotificationScreen = () => {

  // take objectNotification from redux
  const { objectNotification } = useSelector(
    (state: ApplicationState) => state.notificationReducer
  );

  const [dataSource, setDataSource] = useState([]);

  const dateSortDesc = (array: []) => {
    return array.sort(
      (a: any, b: any) =>
        Number(new Date(b.updateDttm)) -
        Number(new Date(a.updateDttm))
    );
  };

  useEffect(() => {
    if (objectNotification && objectNotification.notifications?.length > 0) {
      setDataSource(dateSortDesc(objectNotification.notifications));
    }
  }, [objectNotification]);

  console.log('objectNotification', objectNotification);


  return (
    <SafeAreaView>
      <HeaderCommon
        title={"Notification"}
      />
      <ScrollView style={{ height: '93%', marginTop: 5 }}>
        {objectNotification.notifications?.length > 0 ?
          dataSource.map((item: any) => (
            <ItemNotification
              key={item.id} id={item.id} createUser={item.createUser}
              createdDate={item.createdDate} lastModifiedUser={item.lastModifiedUser}
              updateDttm={item.updateDttm} content={item.content} thumbnail={item.thumbnail} permalink={item.permalink} read={item.read}
              type={item.type} fullName={item.fullName} />
          ))
          :
          <View style={{ alignItems: 'center', marginTop: 130 }}>
            <Ionicons name="notifications-off" size={180} color="#AEAEAE" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#AEAEAE' }}>Notification empty</Text>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default NotificationScreen

const styles = StyleSheet.create({})