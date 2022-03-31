import React, { Component } from "react";
import {
  Text,
  BackHandler,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  View,
  StyleSheet,
  Keyboard,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import {
  config,
  Otpprovider,
  Mapprovider,
  apifuntion,
  Colors,
  Font,
  validation,
  mobileH,
  mobileW,
  SocialLogin,
  Cameragallery,
  mediaprovider,
  localStorage,
  Lang_chg,
  consolepro,
  msgProvider,
  msgTitle,
  msgText,
  Currentltlg,
} from "./Provider/utilslib/Utils";
import CSSstyle from "./css";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { localimag } from "../src/Provider/Localimage";
import Footer from "./Provider/Footer";

const photodata = [
  { "id": 0, image: "NA", file: "NA", status: false },
  { "id": 1, image: "NA", file: "NA", status: false },
  { "id": 2, image: "NA", file: "NA", status: false },
  { "id": 3, image: "NA", file: "NA", status: false },
  { "id": 4, image: "NA", file: "NA", status: false },

];
export default class SalePost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      cateagoryname: "Choose Category",
      seeekingitem: "",
      budget: "",
      specificitem: "",
      latitude: config.latitude,
      longitude: config.longitude,
      location: null,
      location2: "",
      photodata: photodata,
      cameramodalon: false,
      checkboxes: [
        {
          name: 'Quick delivery for',
          isChecked: false,
          cost: null,
          var: 'quick_delivery'
        },
        {
          name: 'Express Post',
          isChecked: false,
          cost: null,
          var: 'express_post'
        },
        {
          name: 'Standard Post',
          isChecked: false,
          cost: null,
          var: 'standard_post'
        }
      ]
    };

  }

  componentDidMount() {

    let pic_arr = this.state.photodata;
    for (let i = 0; i < pic_arr.length; i++) {
      pic_arr[i].image = "NA";
    }
    this.setState({ photodata: pic_arr });

    this.props.navigation.addListener("focus", () => {
      this.getvalue();
      this.getaddress();
      // this.setState({ photodata: photodata });
    });
    // this.getvalue()
  }

  //--------------------------get user detail from local database---------------------//
  getvalue = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    consolepro.consolelog("user_details", user_details);
    if (user_details != null) {
      this.setState({
        user_id: user_details.user_id,
      });
    }
  };
  //--------------------------get user selected address---------------------//
  getaddress = async () => {
    if (user_address != "") {
      this.setState({
        location: user_address,
        location2: user_address2,
        latitude: user_address_lat,
        longitude: user_address_long,

      });
    }
  };


  _openCamera = () => {
    mediaprovider.launchCamera().then((obj) => {
      consolepro.consolelog("imageobj", obj);
      this.setState({ cameramodalon: false });
      let data = this.state.photodata;
      for (let i = 0; i < data.length; i++) {
        if (data[i].image == "NA") {
          data[i].image = obj.path;
          break;
        }
      }
      this.setState({
        photodata: data,
      });
    });
  };

  _openGellery = () => {

    mediaprovider.launchGellery().then((obj) => {
      consolepro.consolelog("imageobj", obj);
      this.setState({ cameramodalon: false });
      if (obj.mime === "image/jpeg") {
        let data = this.state.photodata;
        for (let i = 0; i < data.length; i++) {
          if (data[i].image === "NA") {
            data[i].image = obj.path;

            break;
          }

        }
        this.setState({
          photodata: data,
        });

      }
    });
  };
  //-----------------check already image or not-----------------//
  cameraclcik = (item, index) => {
    if (item.image == "NA") {
      this.setState({ cameramodalon: true });
    }
  };
  //--------------------------delete images---------------------//
  deleteiamage = (index) => {
    let data = this.state.photodata;
    data[index].image = "NA";
    this.setState({
      photodata: data,
    });
  };
  //--------------------------Create new ads---------------------//
  newpostadd = async () => {
    Keyboard.dismiss();
    let user_details = await localStorage.getItemObject("user_arr");
    consolepro.consolelog("user_details", user_details);
    if (user_details != null) {
      let user_id = user_details.user_id;

      if (category_id == "" || category_id == null) {
        msgProvider.toast(validation.emptycategory[config.language], "center");
        return false;
      }
      let title = this.state.title.trim();
      if (title.length <= 0) {
        msgProvider.toast(validation.emptySellTitle[config.language], "center");
        return false;
      }
      let budget = this.state.budget.trim();
      if (budget.length <= 0) {
        msgProvider.toast(validation.emptybudget[config.language], "center");
        return false;
      }
      let description = this.state.specificitem.trim();
      if (description.length <= 0) {
        msgProvider.toast(validation.emptyspecific[config.language], "center");
        return false;
      }

      if (!this.state.isAgree) {
        msgProvider.toast('You should agree our Terms and Conditions', 'center');
        return false;
      }
      let image_arr = this.state.photodata;
      let imageavailable = false;
      for (let j = 0; j < image_arr.length; j++) {
        if (image_arr[j].image != "NA") {
          imageavailable = true;
        }
      }
      // if (imageavailable == false) {
      //     msgProvider.toast(validation.emptyadsimage[config.language], 'center')
      //     return false;
      // }

      let location = user_address;
      let location2 = user_address2;
      if (location.length <= 0) {
        msgProvider.toast(validation.emptyAddress[config.language], "center");
        return false;
      }

      const info = {};
      const items = [...this.state.checkboxes]

      console.log(JSON.parse(JSON.stringify(info)), 'inf================')
      let url = config.baseURL + "api/add_new_post.php";
      var data = new FormData();
      data.append("user_id", user_id);
      data.append("category_id", category_id);
      data.append("item_title", title);
      data.append("price", this.state.budget);
      data.append("address", location);
      data.append("address2", location2);
      data.append("latitude", this.state.latitude);
      data.append("longitude", this.state.longitude);
      data.append("item_description", description);
      data.append("for_sale", "1");
      // data.append("delivery_info", JSON.parse(JSON.stringify(info)));

      items.map(c => {
        data.append(`delivery_info[${c.var}][valid]`, c.isChecked)
        data.append(`delivery_info[${c.var}][price]`, parseFloat(c.cost))
      })
      for (let i = 0; i < image_arr.length; i++) {
        if (image_arr[i].image != "NA") {
          data.append("ads_image[]", {
            uri: image_arr[i].image,
            type: "image/jpg",
            name: "image.jpg",
          });
        }
      }


      consolepro.consolelog("send data", data);

      apifuntion.postApi(url, data).then((obj) => {
        consolepro.consolelog("test111", obj);
        if (obj.success == "true") {

          homerefresh = true;

          msgProvider.toast(obj.msg[config.language], "center");
          user_address = "";
          user_address2 = "";
          category_id = "";
          this.props.navigation.navigate("Homepage");


        } else {
          if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
            config.checkUserDeactivate(this.props.navigation);
          } else {
            msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          }
          return false;
        }
      }).catch(err => {
        consolepro.consolelog("err11", err);
      });

    }
  };

  render() {

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => {
        Keyboard.dismiss();
      }} style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor1 }} />
        <StatusBar barStyle="light-content" backgroundColor={Colors.newcolor1} hidden={false} translucent={false}
                   networkActivityIndicatorVisible={true} />

        <Cameragallery mediamodal={this.state.cameramodalon} Camerapopen={() => {
          this._openCamera();
        }} Galleryopen={() => {
          this._openGellery();
        }} Canclemedia={() => {
          this.setState({ cameramodalon: false });
        }} />

       <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.whiteColor }}
                              behavior={Platform.OS === "ios" ? "padding" : null}>
          <ScrollView>
            <View style={{ backgroundColor: Colors.newcolor, paddingBottom: windowHeight * 2 / 100 }}>

              <View style={[CSSstyle.notification_header, {
                backgroundColor: Colors.newcolor1,
                elevation: 1,
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.20,
                paddingTop: 10,
                paddingBottom: 10,
              }]}>
                <TouchableOpacity activeOpacity={.7} style={{  padding: 5, width: 70 }}
                                  onPress={() => {
                                    this.setState({ photodata: photodata });
                                    this.props.navigation.goBack();
                                  }}>
                  <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.leftarrow}/>
                </TouchableOpacity>
                <View style={{ justifyContent: "center" }}>
                  <Text style={[CSSstyle.Notifications_title, {fontSize: 17}]} numberOfLines={1}>Post What You're Selling</Text>
                </View>

                <View style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingHorizontal: 0 / 100,
                  width: 70
                }}>
                  <TouchableOpacity style={{ paddingHorizontal: windowWidth * 2 / 100 }} onPress={() => {
                    this.newpostadd();
                  }}>
                    <Text style={[styles.edittext1]}>{"Submit"}</Text>
                  </TouchableOpacity>

                </View>
              </View>

              <View style={{ width: "100%", alignItems: "center", alignSelf: "center" }}>

                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate("Selectcategorie");
                }} style={[styles.mainview, {
                  marginTop: windowHeight * 0.5 / 100,
                  backgroundColor: Colors.newcolor,
                }]}>
                  <Text style={[styles.txtitem1, {}]}>What is the item that you are selling?</Text>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={styles.txtview}>
                            {category_id == "" || category_id == null ?
                              <Text style={[styles.edittext, {}]}>{this.state.cateagoryname} </Text> :
                              <Text style={[styles.edittext, {}]}>{categoryname} </Text>
                            }
                        </View>
                        <View style={styles.imageview}>
                            <Image style={styles.icon} source={localimag.selectarrowicon}></Image>
                        </View>
                    </View>
                </TouchableOpacity>

                  <View style={{ width: "100%", alignSelf: "center", paddingHorizontal: 10, backgroundColor: Colors.newcolor1, paddingBottom: 20 }}>
                      <TextInput
                        value={this.state.title}
                        onChangeText={(txt) => {
                            this.setState({ title: txt });
                        }}
                        keyboardType="default"
                        maxLength={70}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={() => {
                        }}
                        style={[styles.edittext, { height: windowHeight * 5 / 100 }]}
                        placeholderTextColor={Colors.lightfontcolor}
                        placeholder={Lang_chg.txtTitle[config.language]}/>
                  </View>

                  <View style={[styles.mainview1, {backgroundColor: Colors.newcolor}]}>
                      <Text style={[styles.txtitem1, {}]}>What are the specifics of the item you're selling</Text>

                      <View style={{ width: "100%", alignSelf: "center" }}>
                          <TextInput
                            value={"" + this.state.specificitem + ""}
                            onChangeText={(txt) => {
                                this.setState({ specificitem: txt });
                            }}
                            keyboardType="default"
                            maxLength={150}
                            multiline={true}
                            returnKeyLabel="done"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                            }}
                            style={[styles.edittext, { textAlignVertical: "top", height: windowHeight * 7 / 100 }]}
                            placeholderTextColor={Colors.lightfontcolor}
                            placeholder={'Enter description'}/>
                      </View>
                      <View style={styles.imageview}>
                          <Image style={styles.icon} source={localimag.editarrowicon}></Image>
                      </View>

                  </View>
                  <View style={[styles.mainview, { backgroundColor: Colors.newcolor1 }]}>
                      <Text style={[styles.txtitem1, {}]}>What's your price</Text>

                      <View style={{ width: "100%", alignSelf: "center" }}>
                          <TextInput
                            value={"" + this.state.budget + ""}
                            onChangeText={(txt) => {
                                this.setState({ budget: txt });
                            }}
                            keyboardType="number-pad"
                            maxLength={70}

                            returnKeyLabel="done"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                            }}
                            style={[styles.edittext, { height: windowHeight * 5 / 100 }]}
                            placeholderTextColor={Colors.lightfontcolor}
                            placeholder={'0.00'}
                          />
                      </View>

                  </View>

                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate("Location");
                }} style={[styles.mainview, { backgroundColor: Colors.newcolor }]}>

                  <Text style={[styles.txtitem1, {}]}>Suburb - free pickup location</Text>

                  <View style={[styles.txtview]}>

                      <Text style={[styles.edittext, {}]}>{this.state.location || 'Enter your Suburb'}</Text>
                  </View>
                   <View style={styles.imageview}>
                                    <Image style={styles.icon} source={localimag.locationicon}></Image>
                                </View>
                </TouchableOpacity>
                {this.state.checkboxes?.map((c, i) =><View key={i} style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 13}}>
                  <TouchableOpacity style={{flex: 2,flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}} onPress={() => {
                    const items = [...this.state.checkboxes];
                    items[i].isChecked = !items[i].isChecked;
                    this.setState({checkboxes: items})
                  }}>
                    <View style={{width: 20, height: 20, borderWidth: 1,
                      justifyContent: 'center', alignItems: 'center',
                      borderRadius: 20,
                      borderColor: this.state.checkboxes[i].isChecked ? '#6600ed' : 'lightgray',
                      backgroundColor: this.state.checkboxes[i].isChecked ? '#6600ed' : 'white'
                    }}>
                      <Image source={localimag.check} style={{width: 10, height: 10, marginTop: 3, resizeMode: 'contain', tintColor: 'white'}}/>
                    </View>
                    <Text style={{marginLeft: 10}}>{c.name}</Text>
                  </TouchableOpacity>
                  <TextInput
                    value={c.cost}
                    onChangeText={(txt) => {
                      const items = [...this.state.checkboxes];
                      items[i].cost = txt;
                      this.setState({checkboxes: items})
                    }}
                    keyboardType="number-pad"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    style={[styles.edittext, { height: windowHeight * 3 / 100, flex: 1 }]}
                    placeholderTextColor={Colors.lightfontcolor}
                    placeholder={'Enter the cost'}
                  />
                </View>)}
                <Text style={[styles.txtitem1, { marginTop: windowHeight * 3 / 100,paddingHorizontal:windowWidth*3/100 }]}>Do you have any images as an example?</Text>

                <View style={{ width:'100%',alignSelf:'center',paddingLeft:10,alignItems:'flex-start', marginTop: windowHeight * 1.2 / 100}}>
                  <Text style={[styles.edittext, {textAlign:'left'}]}>{"Upload example photos of what you're seeking"}</Text>
                </View>



                <View style={{backgroundColor:Colors.newcolor,  paddingHorizontal:windowWidth*3/100, flexDirection: 'row', width: '100%', alignSelf: 'center', marginTop: windowHeight * 2 / 100,paddingBottom:windowHeight*2/100 }}>
                  <FlatList
                    data={this.state.photodata}
                    horizontal={true}

                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity style={{ marginHorizontal: windowWidth*3/100, width: windowWidth * 18 / 100, height: windowWidth * 16 / 100 }} onPress={() => { this.cameraclcik(item, index) }}>
                          {item.image == 'NA' ? <View style={{ width: '100%', height: '100%', backgroundColor: '#e3d8d8',  justifyContent: 'center' }}>
                              <Image style={{ width: windowWidth * 4 / 100, height: windowWidth * 4 / 100, resizeMode: 'cover', alignSelf: 'center' }} source={localimag.plus} />
                            </View> :
                            <View style={{ width: '100%', height: '100%', backgroundColor: '#e3d8d8',  justifyContent: 'center' }}>
                              <ImageBackground imageStyle={{  }} style={{ width: windowWidth * 18 / 100, height: windowWidth * 16 / 100, resizeMode: 'cover', alignSelf: 'center' }} source={{ uri: item.image }} >
                                <TouchableOpacity onPress={() => { this.deleteiamage(index) }}>
                                  <Image style={{ width: 20, height: 20, borderRadius: 50, alignSelf: 'flex-end' }} source={localimag.crossicon} />
                                </TouchableOpacity>
                              </ImageBackground>


                            </View>}


                        </TouchableOpacity>
                      )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
                <TouchableOpacity style={{marginTop: 30,flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}} onPress={() => {this.setState({isAgree: !this.state.isAgree})}}>
                  <View style={{
                    width: 20, height: 20, borderWidth: 1,
                    justifyContent: 'center', alignItems: 'center',
                    borderRadius: 3,
                    borderColor: this.state.isAgree ? '#6600ed' : 'lightgray',
                    backgroundColor: this.state.isAgree ? '#6600ed' : 'white'}}
                  >
                    <Image source={localimag.check} style={{width: 10, height: 10, marginTop: 3, resizeMode: 'contain', tintColor: 'white'}}/>
                  </View>
                  <Text style={{marginLeft: 10}}>I agree to the <Text style={{textDecorationLine: 'underline'}}>Terms of Service</Text> and <Text style={{textDecorationLine: 'underline'}}>Privacy Policy</Text></Text>
                </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.newpostadd() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 10 / 100, }]}>
                    <Text style={styles.txtlogin}>{Lang_chg.submit[config.language]}</Text>
                </TouchableOpacity>
              </View>


            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  edittext: {
    fontSize: windowWidth * 3.4 / 100,
    width: "100%",
    paddingVertical: windowWidth * .1 / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.lightfontcolor,
  },
  edittext1: {
    fontSize: windowWidth * 3.5 / 100,
    paddingVertical: windowWidth * .1 / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.theme_color1,
  },

  img: {
    width: windowWidth * 24 / 100,
    height: windowWidth * 24 / 100,
    resizeMode: "contain",
    alignSelf: "center",
  },
  txtlogin: {
    fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: "center",
  },
  mainview1: {
    paddingHorizontal: windowWidth * 3 / 100,
    width: "100%",
    height: windowHeight * 13 / 100,
    paddingVertical: windowHeight * 1.5 / 100,
    backgroundColor: Colors.newcolor1,
    alignSelf: "center",
    justifyContent: "center",
  },
  mainview: {
    paddingHorizontal: windowWidth * 3 / 100,
    height: windowHeight * 13 / 100,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  imageview: { width: "10%", paddingTop: windowHeight * .6 / 100, alignItems: "center" },
  txtview: { width: "100%", paddingVertical: windowHeight * 1 / 100, alignSelf: "center" },

  icon: {
    width: windowWidth * 4 / 100,
    height: windowWidth * 4 / 100,
    resizeMode: "cover", alignSelf: "center",
  },

  txteditemail: {
    paddingVertical: windowHeight * .1 / 100,
    fontSize: windowWidth * 3.7 / 100,
    width: "100%",
    fontFamily: Font.Poppins_Bold,
    color: Colors.lightfontcolor,
  },
  txtitem: {
    width: "100%",
    paddingVertical: windowWidth * .1 / 100,
    fontSize: windowWidth * 4.4 / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.blackColor,
    alignSelf: "flex-start",
    marginHorizontal: windowWidth * 0 / 100,

  },
  txtitem1: {
    width: "100%",
    paddingVertical: windowWidth * .1 / 100,
    fontSize: windowWidth * 3.8 / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.blackColor,
    alignSelf: "flex-start",
    marginHorizontal: windowWidth * 0 / 100,

  },

});
