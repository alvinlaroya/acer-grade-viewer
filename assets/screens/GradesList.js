import React, { Component, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList } from "react-native";
import { Appbar, List, Avatar, IconButton, Snackbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import moment from "moment";
import { fb } from "../../firebase";
const db = fb.firestore();

const GradesList = ({ route, navigation }) => {
  const { sy, stage, type } = route.params;
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const _goBack = () => navigation.goBack(null);

  useEffect(() => {
    const unsubscribe = db
      .collection("students")
      .onSnapshot((querySnapshot) => {
        const studentsArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setStudents(studentsArr);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderStudents = ({ item, index }) => (
    <>
      <List.Item
        title={`${item.fname} ${item.lname}`}
        titleStyle={{ fontWeight: "bold", marginLeft: 10 }}
        /* description={moment.unix(item.createdAt.seconds).format("DD MMM YYYY hh:ss A")} */
        description={`LRN: ${item.lrn}`}
        descriptionStyle={{ marginLeft: 10 }}
        left={(props) => (
          <Avatar.Image
            {...props}
            size={40}
            source={{ uri: item.profile }}
            style={{ marginTop: 8, marginLeft: 10 }}
          />
        )}
        onPress={() => navigation.navigate("MyGrades", {
            sy: sy,
            name: `${item.fname} ${item.lname}`,
            profile: item.profile,
            level: stage,
            type: type,
            lrn: item.lrn
        })}
      />
    </>
  );

  return isLoading ? (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Loading...</Text>
    </View>
  ) : (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <Appbar.Header style={{ backgroundColor: "white", marginTop: Constants.statusBarHeight}}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content
          title={`School Year: ${sy}`}
          subtitle={`List of students in ${stage}`}
        />
        {type === "Admin" && (
          <Appbar.Action
            icon="plus"
            onPress={() =>
              navigation.navigate("AddGrade", {
                sy: sy,
                level: stage,
                type: type,
              })
            }
          />
        )}
      </Appbar.Header>
      {students.length > 0 ? (
        <FlatList
          style={{ backgroundColor: "white" }}
          showsVerticalScrollIndicator={false}
          data={students}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={(item) => renderStudents(item)}
          initialNumToRender={10}
          inverted={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={1}
          /* onEndReached={_handleLoadMore} */
          onEndReachedThreshold={0.5}
          /*   onRefresh={_handleRefresh}
            refreshing={refreshing} */
          getItemLayout={(data, index) => ({
            length: 40,
            offset: 40 * index,
            index,
          })}
          /*  ListFooterComponent={_renderFooter} */
          inverted={false}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>No students to display</Text>
        </View>
      )}
    </>
  );
};

export default GradesList;
