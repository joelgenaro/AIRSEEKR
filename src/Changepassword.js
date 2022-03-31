import React, { Component } from 'react'
import {I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,  Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {localimag} from '../src/Provider/Localimage';
export default class Changepassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
           oldpassword:'',
           newpassword:'',
           confirmpassword:'',
           secureoldpassword:true,
           securenewpassword:true,
           secureconfirmpassword:true,
           user_id:'',
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
         });
    }

    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
          this.setState({
            user_id:user_details.user_id,
         
          })
           
        }
      }
    changepassword=async()=>{
        Keyboard.dismiss()
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
        let user_id=user_details.user_id;
                let password = this.state.oldpassword.trim();
                if (password.length <= 0) {
                    msgProvider.toast(validation.emptyOldPassword[config.language], 'center')
                    return false;
                }
                let newpassword = this.state.newpassword.trim();
                if (newpassword.length <= 0) {
                    msgProvider.toast(validation.emptynewPassword[config.language], 'center')
                    return false;
                }
                if (newpassword.length <= 5) {
                    msgProvider.toast(validation.lengthnewPassword[config.language], 'center')
                    return false;
                }
                let confirmpassword = this.state.confirmpassword.trim();
                if (confirmpassword.length <= 0) {
                    msgProvider.toast(validation.emptyconfirmPassword[config.language], 'center')
                    return false;
                }

                if(newpassword != confirmpassword){
                    msgProvider.toast(validation.verifynewpassword[config.language], 'center')
                    return false;
                }
                if(password == newpassword){
                    msgProvider.toast(validation.oldnewpassword[config.language], 'center')
                    return false;
                }

                let url = config.baseURL + "change_password.php";
                var data = new FormData();
                data.append('old_password',password)
                data.append('new_password', newpassword)
                data.append("user_id", user_id)

                consolepro.consolelog('test', data)
                this.setState({ oldpassword: '',newpassword:'', confirmpassword:'' })
                apifuntion.postApi(url, data).then((obj) => {
                    consolepro.consolelog('test', obj)
                    if (obj.success == 'true') { 
                        var user_details = obj.user_details;
                        localStorage.setItemObject('user_arr', user_details);
                        msgProvider.toast(obj.msg[config.language], 'long')
                        this.props.navigation.navigate('Login')

                    } else {
                        if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                            config.checkUserDeactivate(this.props.navigation)
                        } else {
                            msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                        }
                        return false;
                    }
                }).catch(err => {
                    consolepro.consolelog('err', err);
                });
            }
    }
    
    
    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                     <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                                        <View style={CSSstyle.notification_header}>
                                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                                            </TouchableOpacity>
                                            <Text style={[CSSstyle.Notifications_title, {  }]}>{Lang_chg.changepassword[config.language]}</Text>
                                            <View >
                                                <Text ></Text>
                                            </View>
                                      </View> 
                                    
                                     


                       <View style={[styles.mainview,{marginTop:windowHeight*7/100}]}>
                           <View style={{width:'8%',alignItems:'center',}}>
                                <Image  style={styles.edittxticon} source={localimag.passwordicon}></Image>
                            </View>
                            <View style={{width:'81%',marginHorizontal:3,alignItems:'center'}}>    
                                <TextInput 
                                 value={"" + this.state.oldpassword + ""}
                                        onChangeText={(txt) => { this.setState({ oldpassword: txt }) }}
                                        keyboardType='default'
                                        secureTextEntry={this.state.secureoldpassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={I18nManager.isRTL == false ? [styles.txtaddtype,{textAlign:'left'}]:[styles.txtaddtype,{textAlign:'right'}]}
                                    
                                        placeholderTextColor={Colors.border_color1} placeholder={Lang_chg.oldpassword[config.language]}></TextInput>
                            </View>
                            <TouchableOpacity onPress={() => { this.setState({ secureoldpassword: !this.state.secureoldpassword }) }} style={{width:'11%',alignItems:'center',justifyContent:'center'}}>
                                {this.state.secureoldpassword ?  <Text  style={styles.icontext1}>{Lang_chg.show[config.language]}</Text> :
                                    <Text  style={styles.icontext1}>{Lang_chg.hide[config.language]}</Text>
                                }
                                </TouchableOpacity>
                        </View>
                        <View style={[styles.mainview,{marginTop:windowHeight*3.2/100}]}>
                           <View style={{width:'8%',alignItems:'center',}}>
                                <Image  style={styles.edittxticon} source={localimag.passwordicon}></Image>
                            </View>
                            <View style={{width:'81%',marginHorizontal:3,alignItems:'center'}}>    
                                <TextInput 
                                 value={"" + this.state.newpassword + ""}
                                        onChangeText={(txt) => { this.setState({ newpassword: txt.trim() }) }}
                                        keyboardType='default'
                                        secureTextEntry={this.state.securenewpassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={I18nManager.isRTL == false ? [styles.txtaddtype,{textAlign:'left'}]:[styles.txtaddtype,{textAlign:'right'}]}
                                         placeholderTextColor={Colors.border_color1} placeholder={Lang_chg.newpassword[config.language]}></TextInput>
                          </View>
                            <TouchableOpacity onPress={() => { this.setState({ securenewpassword: !this.state.securenewpassword }) }} style={{width:'11%',alignItems:'center',justifyContent:'center'}}>
                                {this.state.securenewpassword ?  <Text  style={styles.icontext1}>{Lang_chg.show[config.language]}</Text> :
                                    <Text  style={styles.icontext1}>{Lang_chg.hide[config.language]}</Text>
                                }
                                </TouchableOpacity>
                        </View>
                        <View style={[styles.mainview,{marginTop:windowHeight*3.2/100}]}>
                           <View style={{width:'8%',alignItems:'center',}}>
                                <Image  style={styles.edittxticon} source={localimag.passwordicon}></Image>
                            </View>
                            <View style={{width:'81%',marginHorizontal:3,alignItems:'center'}}>    
                                <TextInput 
                                 value={"" + this.state.confirmpassword + ""}
                                        onChangeText={(txt) => { this.setState({ confirmpassword: txt.trim() }) }}
                                        keyboardType='default'
                                        secureTextEntry={this.state.secureconfirmpassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={I18nManager.isRTL == false ? [styles.txtaddtype,{textAlign:'left'}]:[styles.txtaddtype,{textAlign:'right'}]}

                                        placeholderTextColor={Colors.border_color1} placeholder={Lang_chg.confirmnewpassword[config.language]}></TextInput>
                            </View>
                            <TouchableOpacity onPress={() => { this.setState({ secureconfirmpassword: !this.state.secureconfirmpassword }) }} style={{width:'11%',alignItems:'center',justifyContent:'center'}}>
                                {this.state.secureconfirmpassword ?  <Text  style={styles.icontext1}>{Lang_chg.show[config.language]}</Text> :
                                    <Text  style={styles.icontext1}>{Lang_chg.hide[config.language]}</Text>
                                }
                                </TouchableOpacity>
                        </View>

                        




                       

                        <TouchableOpacity onPress={()=>{this.changepassword()}} style={[CSSstyle.mainbutton,{marginTop:windowHeight*12/100,width:'90%'}]}>
                             
                             <Text style={styles.txtlogin}>{Lang_chg.submit[config.language]}</Text>
                        </TouchableOpacity>

                      </View>

              </View>         
                   

                  
        )
    }
}



const styles = StyleSheet.create({
    edittxticon:{ width:windowWidth*5.5/100,
        height:windowWidth*5.5/100,
        resizeMode: 'contain',marginTop:windowHeight*.2/100},
    icontext1: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'center'
    },
         txtaddtype:{fontSize:windowWidth*3.8/100,width:'100%',paddingVertical:windowWidth*.1/100,fontFamily:Font.Poppins_Regular,color:Colors.blackColor},
    txtlogin:{
        fontSize:windowWidth*4/100,fontFamily:Font.Poppins_Bold,color:Colors.whiteColor,alignSelf:'center'
    },
    mainview:{width:'90%',paddingBottom:windowWidth*2/100,borderColor:Colors.theme_color1,borderBottomWidth:1, flexDirection:'row',backgroundColor:Colors.whiteColor,alignSelf:'center',},
});