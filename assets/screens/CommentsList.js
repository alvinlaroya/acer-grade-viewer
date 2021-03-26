import React, { Component } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList } from "react-native";
import { Appbar, List, Avatar, IconButton, Snackbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import RBSheet from "react-native-raw-bottom-sheet";
import moment from "moment";
import { fb } from "../../firebase";
import firebase from "firebase/app";
const db = fb.firestore();

class CommentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teachers: [],
      comments: [],
      isLoading: true,
      snackbarMessage: "",
      snackbarContent: "",
      snackbarColor: "green",
      currentTeacher: {},
    };
  }

  componentDidMount = () => {
    this.fetchUnsolvedComments();
  };

  componentWillUnmount = () => {
    this.fetchUnsolvedComments();
  }

  fetchStudentRequests = () => {
    const unsubscribe = db
      .collection("users")
      .where("accepted", "==", false)
      .where("type", "==", "Student")
      .limit(50)
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

    return () => unsubscribe();
  };

  fetchUnsolvedComments = () => {
    const unsubscribe = db
      .collection("comments")
      .where("solved", "==", false)
      .where("deleted", "==", false)
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const commentsArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        this.setState({
          comments: commentsArr,
          isLoading: false,
        });
      });

    return () => unsubscribe();
  };
  

  openBottomSheet = (item, index) => {
    this.setState({
      currentTeacher: item,
    });
    this[RBSheet + index].open();
  };

  acceptStudent = (info, index) => {
    this[RBSheet + index].close();
    db.collection("comments").doc(info.id).update({
      solved: true,
    });

    this.setState({
      snackbarColor: 'green',
      snackbarContent: 'Request Accepted!',
      snackbarMessage: true
    })
  };

  declinedStudent = (info, index) => {
    this[RBSheet + index].close();
    db.collection("comments").doc(info.id).update({
      solved: false,
      deleted: true,
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
        title={item.name}
        titleStyle={{ fontWeight: "bold", marginLeft: 10 }}
        description={item.message}
        descriptionStyle={{ marginLeft: 10 }}
        left={(props) => (
          <Avatar.Image
            {...props}
            size={40}
            source={{ uri: item.profile !== '' ? item.profile : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU' }}
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
        onPress={() => this.props.navigation.navigate("ViewComment", {
          gradeParam: item
        })}
      />
      <RBSheet
        ref={ref => {
        this[RBSheet + index] = ref;
      }}
        openDuration={200}
        closeDuration={200}
        height={150}
        /* closeOnDragDown={true} */
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }, // The Root of Component (You can change the `backgroundColor` or any styles)
        }}
      >
        <List.Item
          title="Solved"
          description={`Mark as Solved ${this.state.currentTeacher.name}'s comment`}
          left={(props) => <List.Icon {...props} icon="check" color="green" />}
          onPress={() => this.acceptStudent(this.state.currentTeacher, index)}
        />
        <List.Item
          title="Delete"
          description={`Delete ${this.state.currentTeacher.name}'s comment`}
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
        <Appbar.Header style={{ marginTop: 1, backgroundColor: "white", marginTop: Constants.statusBarHeight }}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()}/>
          <Appbar.Content
            title="Students Comments"
            subtitle={`(${this.state.comments.length}) Submitted student's comments`}
          />
        </Appbar.Header>
        {this.state.comments.length > 0 ? (
          <FlatList
            style={{ backgroundColor: "white" }}
            showsVerticalScrollIndicator={false}
            data={this.state.comments}
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

export default CommentsList;
