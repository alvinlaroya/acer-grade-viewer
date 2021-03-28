import React, { Component } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList } from "react-native";
import { Appbar, List, Avatar, IconButton, Snackbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import RBSheet from "react-native-raw-bottom-sheet";
import Constants from 'expo-constants'
import moment from "moment";
import { fb } from "../../firebase";
import firebase from "firebase/app";
const db = fb.firestore();

class EnrolledStudents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teachers: [],
      isLoading: true,
      snackbarMessage: "",
      snackbarContent: "",
      snackbarColor: "green",
      currentTeacher: {},
    };
  }

  componentDidMount = () => {
    this.fetchStudentRequests();
  };

  fetchStudentRequests = () => {
    db.collection("users")
      .where("accepted", "==", true)
      .where("type", "==", "Student")
      .onSnapshot((querySnapshot) => {
        const teachersArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        this.setState({
          teachers: teachersArr,
          isLoading: false,
        });
      });
  };
  

  openBottomSheet = (item, index) => {
    this.setState({
      currentTeacher: item,
    });
    this[RBSheet + index].open();
  };

  declinedStudent = (info, index) => {
    this[RBSheet + index].close();
    db.collection("users").doc(info.id).update({
      requestStatus: 1,
      accepted: false
    });

    db.collection("guardians").where("childId", "==", info.id)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection("users").doc(doc.id).update({
              accepted: false,
              requestStatus: 1,
            });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    this.setState({
      snackbarColor: 'red',
      snackbarContent: 'Request Declined!',
      snackbarMessage: true
    })
  };

  onDismissSnackBar = () => this.setState({snackbarMessage: false});

  renderAgency = ({ item, index }) => (
    <>
      <List.Item
        disabled={item.requestStatus === 0}
        title={`${item.fname} ${item.lname}`}
        titleStyle={{ fontWeight: "bold", marginLeft: 10 }}
        /* description={moment.unix(item.createdAt.seconds).format("DD MMM YYYY hh:ss A")} */
        description={item.email}
        descriptionStyle={{ marginLeft: 10 }}
        left={(props) => (
          <Avatar.Image
            {...props}
            size={40}
            source={{ uri: item.profile }}
            style={{ marginTop: 8, marginLeft: 10 }}
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="dots-vertical"
            color="black"
            size={25}
            onPress={() => this.openBottomSheet(item, index)}
          />
        )}
        onPress={() => alert("fawf")}
      />
      <RBSheet
        ref={ref => {
        this[RBSheet + index] = ref;
      }}
        openDuration={200}
        closeDuration={200}
        height={100}
        /* closeOnDragDown={true} */
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }, // The Root of Component (You can change the `backgroundColor` or any styles)
        }}
      >
        <List.Item
          title="Set to Pending"
          description={`Decline ${this.state.currentTeacher.fname} ${this.state.currentTeacher.lname}'s account request`}
          left={(props) => <List.Icon {...props} icon="close" color="red" />}
          onPress={() => this.declinedStudent(this.state.currentTeacher, index)}
        />
      </RBSheet>
    </>
  );

  render(){
    return this.isLoading ? (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text>Loading...</Text>
      </View>
    ) : (
      <>
        <StatusBar style="light" backgroundColor="black" />
        <Appbar.Header style={{ marginTop: 1, backgroundColor: "white", marginTop: Constants.statusBarHeight}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()}/>
          <Appbar.Content
            title="Students Requests"
            subtitle={`(${this.state.teachers.length}) Pending students submitted account request`}
          />
        </Appbar.Header>
        {this.state.teachers.length > 0 ? (
          <FlatList
            style={{ backgroundColor: "white" }}
            showsVerticalScrollIndicator={false}
            data={this.state.teachers}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={item => this.renderAgency(item)}
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
            <Text>No Teachers to display</Text>
          </View>
        )}
        <Snackbar
          visible={this.state.snackbarMessage}
          onDismiss={this.onDismissSnackBar}
          style={{ backgroundColor: this.state.snackbarColor }}
          action={{
            label: "Close",
            onPress: () => {
              // Do something
            },
          }}
        >
          {this.state.snackbarContent}
        </Snackbar>
      </>
    );
  }
}

export default EnrolledStudents;
