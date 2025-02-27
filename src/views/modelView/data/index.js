const boneName ={
    "mixamorigHips": "髋关节",
    "mixamorigSpine": "脊柱（第一段）",
    "mixamorigSpine1": "脊柱（第二段）",
    "mixamorigSpine2": "脊柱（第三段）",
    "mixamorigNeck": "颈部",
    "mixamorigHead": "头部",
    "mixamorigRightShoulder": "右肩",
    "mixamorigRightArm": "右上臂",
    "mixamorigRightForeArm": "右前臂",
    "mixamorigRightHand": "右手",
    "mixamorigRightHandThumb1": "右手拇指第一节",
    "mixamorigRightHandThumb2": "右手拇指第二节",
    "mixamorigRightHandThumb3": "右手拇指第三节",
    "mixamorigRightHandIndex1": "右手食指第一节",
    "mixamorigRightHandIndex2": "右手食指第二节",
    "mixamorigRightHandIndex3": "右手食指第三节",
    "mixamorigRightHandMiddle1": "右手中指第一节",
    "mixamorigRightHandMiddle2": "右手中指第二节",
    "mixamorigRightHandMiddle3": "右手中指第三节",
    "mixamorigRightHandRing1": "右手无名指第一节",
    "mixamorigRightHandRing2": "右手无名指第二节",
    "mixamorigRightHandRing3": "右手无名指第三节",
    "mixamorigRightHandPinky1": "右手小指第一节",
    "mixamorigRightHandPinky2": "右手小指第二节",
    "mixamorigRightHandPinky3": "右手小指第三节",
    "mixamorigLeftShoulder": "左肩",
    "mixamorigLeftArm": "左上臂",
    "mixamorigLeftForeArm": "左前臂",
    "mixamorigLeftHand": "左手",
    "mixamorigLeftHandThumb1": "左手拇指第一节",
    "mixamorigLeftHandThumb2": "左手拇指第二节",
    "mixamorigLeftHandThumb3": "左手拇指第三节",
    "mixamorigLeftHandIndex1": "左手食指第一节",
    "mixamorigLeftHandIndex2": "左手食指第二节",
    "mixamorigLeftHandIndex3": "左手食指第三节",
    "mixamorigLeftHandMiddle1": "左手中指第一节",
    "mixamorigLeftHandMiddle2": "左手中指第二节",
    "mixamorigLeftHandMiddle3": "左手中指第三节",
    "mixamorigLeftHandRing1": "左手无名指第一节",
    "mixamorigLeftHandRing2": "左手无名指第二节",
    "mixamorigLeftHandRing3": "左手无名指第三节",
    "mixamorigLeftHandPinky1": "左手小指第一节",
    "mixamorigLeftHandPinky2": "左手小指第二节",
    "mixamorigLeftHandPinky3": "左手小指第三节",
    "mixamorigRightUpLeg": "右大腿",
    "mixamorigRightLeg": "右小腿",
    "mixamorigRightFoot": "右脚",
    "mixamorigRightToeBase": "右脚趾根部",
    "mixamorigLeftUpLeg": "左大腿",
    "mixamorigLeftLeg": "左小腿",
    "mixamorigLeftFoot": "左脚",
    "mixamorigLeftToeBase": "左脚趾根部"
}
let ActorCorerBoneName = {
    "RL_BoneRoot": null, // 可能是整个骨骼系统的根节点位置信息
    "CC_Base_Hip": "mixamorigHips", // 基础臀部骨骼的旋转信息
    "CC_Base_Pelvis": null, // 基础骨盆骨骼的旋转信息
    "CC_Base_L_Thigh": "mixamorigLeftUpLeg", // 基础左大腿骨骼的旋转信息
    "CC_Base_L_Calf": "mixamorigLeftLeg", // 基础左小腿骨骼的旋转信息
    "CC_Base_L_Foot": "mixamorigLeftFoot", // 基础左脚骨骼的旋转信息
    "CC_Base_L_ToeBase": "mixamorigLeftToeBase", // 基础左脚趾根部骨骼的旋转信息
    "CC_Base_L_CalfTwist01": null, // 基础左小腿扭转辅助骨骼01的旋转信息
    "CC_Base_L_ThighTwist01": null, // 基础左大腿扭转辅助骨骼01的旋转信息
    "CC_Base_R_Thigh": "mixamorigRightUpLeg", // 基础右大腿骨骼的旋转信息
    "CC_Base_R_ThighTwist01": null, // 基础右大腿扭转辅助骨骼01的旋转信息
    "CC_Base_R_Calf": "mixamorigRightLeg", // 基础右小腿骨骼的旋转信息
    "CC_Base_R_Foot": "mixamorigRightFoot", // 基础右脚骨骼的旋转信息
    "CC_Base_R_ToeBase": "mixamorigRightToeBase", // 基础右脚趾根部骨骼的旋转信息
    "CC_Base_R_CalfTwist01": null, // 基础右小腿扭转辅助骨骼01的旋转信息
    "CC_Base_Waist": null, // 基础腰部骨骼的旋转信息
    "CC_Base_Spine01": "mixamorigSpine", // 基础脊柱第1节骨骼的旋转信息
    "CC_Base_Spine02": "mixamorigSpine1", // 基础脊柱第2节骨骼的旋转信息
    "CC_Base_NeckTwist01": "mixamorigSpine2", // 基础颈部扭转辅助骨骼01的旋转信息
    "CC_Base_NeckTwist02": "mixamorigNeck", // 基础颈部扭转辅助骨骼02的旋转信息
    "CC_Base_Head": "mixamorigHead", // 基础头部骨骼的旋转信息
    "CC_Base_FacialBone": null, // 基础面部骨骼的旋转信息
    "CC_Base_JawRoot": null, // 基础下颌根部骨骼的旋转信息
    "CC_Base_Tongue01": null, // 基础舌头第1部分骨骼的旋转信息
    "CC_Base_Tongue02": null, // 基础舌头第2部分骨骼的旋转信息
    "CC_Base_UpperJaw": null, // 基础上颚骨骼的旋转信息
    "CC_Base_L_Clavicle": "mixamorigLeftShoulder", // 基础左锁骨骨骼的旋转信息
    "CC_Base_L_Upperarm": "mixamorigLeftArm", // 基础左上臂骨骼的旋转信息
    "CC_Base_L_Forearm": "mixamorigLeftForeArm", // 基础左前臂骨骼的旋转信息
    "CC_Base_L_ForearmTwist01": null, // 基础左前臂扭转辅助骨骼01的旋转信息
    "CC_Base_L_Hand": "mixamorigLeftHand", // 基础左手骨骼的旋转信息
    "CC_Base_L_Mid1": null, // 基础左手中间指骨第1节的旋转信息
    "CC_Base_L_Mid2": null, // 基础左手中间指骨第2节的旋转信息
    "CC_Base_L_Index1": "mixamorigLeftHandIndex1", // 基础左手食指第1节骨骼的旋转信息
    "CC_Base_L_Index2": "mixamorigLeftHandIndex2", // 基础左手食指第2节骨骼的旋转信息
    "CC_Base_L_Ring1": "mixamorigLeftHandRing1", // 基础左手无名指第1节骨骼的旋转信息
    "CC_Base_L_Ring2": "mixamorigLeftHandRing2", // 基础左手无名指第2节骨骼的旋转信息
    "CC_Base_L_Pinky1": "mixamorigLeftHandPinky1", // 基础左手小指第1节骨骼的旋转信息
    "CC_Base_L_Pinky2": "mixamorigLeftHandPinky2", // 基础左手小指第2节骨骼的旋转信息
    "CC_Base_L_Thumb1": "mixamorigLeftHandThumb1", // 基础左手拇指第1节骨骼的旋转信息
    "CC_Base_L_Thumb2": "mixamorigLeftHandThumb2", // 基础左手拇指第2节骨骼的旋转信息
    "CC_Base_L_UpperarmTwist01": null, // 基础左上臂扭转辅助骨骼01的旋转信息
    "CC_Base_R_Clavicle": "mixamorigRightShoulder", // 基础右锁骨骨骼的旋转信息
    "CC_Base_R_Upperarm": "mixamorigRightArm", // 基础右上臂骨骼的旋转信息
    "CC_Base_R_UpperarmTwist01": null, // 基础右上臂扭转辅助骨骼01的旋转信息
    "CC_Base_R_Forearm": "mixamorigRightForeArm", // 基础右前臂骨骼的旋转信息
    "CC_Base_R_ForearmTwist01": null, // 基础右前臂扭转辅助骨骼01的旋转信息
    "CC_Base_R_Hand": "mixamorigRightHand", // 基础右手骨骼的旋转信息
    "CC_Base_R_Mid1": null, // 基础右手中间指骨第1节的旋转信息
    "CC_Base_R_Mid2": null, // 基础右手中间指骨第2节的旋转信息
    "CC_Base_R_Ring1": "mixamorigRightHandRing1", // 基础右手无名指第1节骨骼的旋转信息
    "CC_Base_R_Ring2": "mixamorigRightHandRing2", // 基础右手无名指第2节骨骼的旋转信息
    "CC_Base_R_Thumb1": "mixamorigRightHandThumb1", // 基础右手拇指第1节骨骼的旋转信息
    "CC_Base_R_Thumb2": "mixamorigRightHandThumb2", // 基础右手拇指第2节骨骼的旋转信息
    "CC_Base_R_Index1": "mixamorigRightHandIndex1", // 基础右手食指第1节骨骼的旋转信息
    "CC_Base_R_Index2": "mixamorigRightHandIndex2", // 基础右手食指第2节骨骼的旋转信息
    "CC_Base_R_Pinky1": "mixamorigRightHandPinky1", // 基础右手小指第1节骨骼的旋转信息
    "CC_Base_R_Pinky2": "mixamorigRightHandPinky2", // 基础右手小指第2节骨骼的旋转信息
    "CC_Base_R_RibsTwist": null, // 基础右侧肋骨扭转辅助骨骼的旋转信息
    "CC_Base_L_RibsTwist": null // 基础左侧肋骨扭转辅助骨骼的旋转信息
};
export default {
    boneName,
    ActorCorerBoneName,
}