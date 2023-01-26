import { View, Text } from 'react-native'
import React from 'react'

import { styles } from "./Style";

import LbInputBox from '../../Components/LbInputBox';

import { moderateScale } from 'react-native-size-matters';

const OrganizationRegister_Screen = () => {
  return (
    <View>
      <LbInputBox
              lable="Organization ID :"
              iconName="briefcase-outline"
              outstyle={{marginHorizontal: moderateScale(30)}}
            />
    </View>
  )
}

export default OrganizationRegister_Screen