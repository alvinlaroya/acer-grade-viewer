import React, { Component } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList } from "react-native";
import { Appbar, List, Avatar, IconButton, Snackbar, Divider} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import RBSheet from "react-native-raw-bottom-sheet";
import Constants from 'expo-constants';
import moment from "moment";
import { fb } from "../../firebase";
const db = fb.firestore();

class AdminRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      admins: [],
      isLoading: true,
      snackbarMessage: "",
      snackbarContent: "",
      snackbarColor: "green",
      currentTeacher: {},
    };
  }

  componentDidMount = () => {
    this.fetchAdmins();
  };

  fetchAdmins = () => {
    db.collection("users")
      .where("accepted", "==", false)
      .where("type", "==", "Admin")
      .onSnapshot((querySnapshot) => {
        const adminsArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        this.setState({
          admins: adminsArr,
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

  acceptTeacher = (id, index) => {
    this[RBSheet + index].close();
    db.collection("users").doc(id).update({
      accepted: true,
      requestStatus: 2,
    });

    this.setState({
      snackbarColor: 'green',
      snackbarContent: 'Request Accepted!',
      snackbarMessage: true
    })
  };

  declinedTeacher = (id, index) => {
    this[RBSheet + index].close();
    db.collection("users").doc(id).update({
      requestStatus: 0,
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
        title={`${item.fname} ${item.lname} (${
          item.requestStatus === 0 ? `Declined` : `Pending`
        })`}
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
        height={310}
        /* closeOnDragDown={true} */
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }, // The Root of Component (You can change the `backgroundColor` or any styles)
        }}
      >
        <View style={{alignItems: 'center', marginBottom: 20, marginTop: 10}}>
          <Avatar.Image
            size={80}
            source={{ uri: this.state.currentTeacher.profile }}
          />
          <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 7}}>{this.state.currentTeacher.fname} {this.state.currentTeacher.lname}</Text>
          <Text>{this.state.currentTeacher.address}</Text>
        </View>
        <Divider />
        <List.Item
          title="Accept"
          description={`Accept ${this.state.currentTeacher.fname} ${this.state.currentTeacher.lname}'s account request`}
          left={(props) => <List.Icon {...props} icon="check" color="green" />}
          onPress={() => this.acceptTeacher(this.state.currentTeacher.id, index)}
        />
        <List.Item
          title="Decline"
          description={`Decline ${this.state.currentTeacher.fname} ${this.state.currentTeacher.lname}'s account request`}
          left={(props) => <List.Icon {...props} icon="close" color="red" />}
          onPress={() => this.declinedTeacher(this.state.currentTeacher.id, index)}
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
            title="Admin Requests"
            subtitle={`(${this.state.admins.length}) Pending admin submitted account request`}
          />
        </Appbar.Header>
        {this.state.admins.length > 0 ? (
          <FlatList
            style={{ backgroundColor: "white" }}
            showsVerticalScrollIndicator={false}
            data={this.state.admins}
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
            <Text>No Admin to display</Text>
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

export default AdminRequests;
