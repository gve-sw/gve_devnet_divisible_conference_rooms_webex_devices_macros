/*
Copyright (c) 2023 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*
*
* Repository: gve_devnet_divisible_conference_rooms_webex_devices_macros
* Macro file: divisible_room_secondary
* Version: 1.0.2
* Released: Feb 4, 2025
* Latest RoomOS version tested: 11.25.1.4 
*
* Macro Author:      	Gerardo Chaves
*                    	Technical Solutions Architect
*                    	gchaves@cisco.com
*                    	Cisco Systems
*
* Consulting Engineer: Robert(Bobby) McGonigle Jr
*                    	 Technical Marketing Engineer
*                    	 bomcgoni@cisco.com
*                    	 Cisco Systems
* 
*    
* 
*    As a macro, the features and functions of this webex n-way divisibe conference  
*    rooms macro are not supported by Cisco TAC
* 
*    Hardware and Software support are provided by their respective manufacturers 
*      and the service agreements they offer
*    
*    Should you need assistance with this macro, reach out to your Cisco sales representative
*    so they can engage the GVE DevNet team. 
*/

import xapi from 'xapi';
import { GMM } from './GMM_Lib'

const minOS10Version = '10.17.1.0';
const minOS11Version = '11.2.1.0';



const JS_PRIMARY = 1, JS_SECONDARY = 2, JS_AUXILIARY = 3, JS_LOCAL = 0



/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ SECTION 1 - SECTION 1 - SECTION 1 - SECTION 1 - SECTION 1 - SECTION 1 +
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/


// set SECONDARY_MULTI_CAM to true if you intend to allow local switching of cameras on a secondary
// codec, with or without the assistance of local auxiliary codecs
const SECONDARY_MULTI_CAM = false;

// In this section, write in the values for the constants below.
// If you wired your rooms different from what is indicated in the Version_3_Two-way_System_Drawing.pdf document
// you can modify the  SECONDARY_VIDEO_TIELINE_OUTPUT_TO_PRI_SEC_ID
// SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID and SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID constants
// to match your setup. 
// For PRIMARY_CODEC_ADDRESS enter the IP address for the Primary Codec. 

const SECONDARY_VIDEO_TIELINE_OUTPUT_TO_PRI_SEC_ID = 3; // change only for non-standard singe screen setups
const SECONDARY_AUDIO_TIELINE_OUTPUT_TO_PRI_ID = 5; // change only if non standard (i.e. codec EQ)
const SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID = 3; // change only for non-standard singe screen setups
const SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID = 4; // change only for non-standard singe screen setups
const PRIMARY_CODEC_ADDRESS = '10.0.0.100'; // IP address or webex codec ID (if PRIMARY_BOT_TOKEN is set) for primary codec. To obtain codec ID: xStatus Webex DeveloperId


// If you fill out the PRIMARY_CODEC_USER and PRIMARY_CODEC_PASSWORD with the credentials to be able to log
// into the the Secondary codec (if configuring Primary) or Primary codec (if configuring Secondary)
// they will be used to establish an HTTP connection with that other codec, but these credentials will be
// stored clear text in the macro. 
// If you wish to slightly obfuscate the credentials, use a Base64 encoded string for PRIMARY_CODEC_USER and
// leave PRIMARY_CODEC_PASSWORD blank. If you do that, you would need to combine the username and password in one string
// separated by a colon (i.e. "username:password") before Base64 encoding with a tool such as https://www.base64encode.org/
// Instructions for creating these admin accounts are in the "Installation Instructions" document.
const PRIMARY_CODEC_USER = '';
const PRIMARY_CODEC_PASSWORD = '';


// You can fill out the PRIMARY_BOT_TOKEN value intead of PRIMARY_CODEC_USER/PRIMARY_CODEC_PASSWORD to use the Webex cloud to
// communicate with other codecs in the system. it should contain the Bot access token you wish to use to have the codec use
// when sending commands to the other codecs by using Webex messaging. 
// NOTE: You must add the Bot that corresponds to the bot token you intend to use to the API access list in the Workspace where the device is configured
// To do so in Control Hub, go to the Workspace for each device, click on the "Edit API Access" button and add the bot to the list (search for it by name)
// with "Full Access" access level. 
const PRIMARY_BOT_TOKEN = '';

// set FQDN_MODE to true if you are using FQDN for primary codec address, otherwise set to false
// If you set FQDN_MODE to true, you must also set the system unit name on this codec
// The system unit name can be either the hostname if the DNS domain is correctly configured, or you can specify a full FQDN  
const FQDN_MODE = false;

// set ALLOW_INSECURE_HTTPS to true if you are using self-signed certificates on the codecs
// set it to false if your codecs have valid certificates from a trusted CA
const ALLOW_INSECURE_HTTPS = true;


/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ SECTION 2 - SECTION 2 - SECTION 2 - SECTION 2 - SECTION 2 - SECTION 2 
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/



// For more reliability when combining and dividing rooms you can use a custom cable connecting the 
// GPIO pins 2-4 between the primary codec and secondary codecs. This cable cannot be used if you have 
// a setup where you need to "promote" a secondary room to primary to accomodate specific room layouts
// in which case the value should be false.
const USE_GPIO_INTERCODEC = false;




// CHK_VUMETER_LOUDSPEAKER specifies if we check the LoudspeakerActivity flag from the VuMeter events
// to ignore any microphone activity while the loudspeakers are active to reduce the possibility of
// switching due to sound coming in from remote participants in the meeting if the AfterAEC setting
// is not being effective. Set to true to perform the check for each microphone activity event. 
const CHK_VUMETER_LOUDSPEAKER = false;

/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ SECTION 3 - SECTION 3 - SECTION 3 - SECTION 3 - SECTION 3 - SECTION 3 +
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/


// Change SECONDARY_COMBINED_VOLUME_CHANGE_STEPS if you want to adjust the volume on the secondary
// codec when switching modes. Each step is equivalent to a 0.5 dB change. Set the value to 0 if you wish
// to simply set the actual volume when combined or standalone by using the SECONDARY_COMBINED_VOLUME_COMBINED and
// SECONDARY_COMBINED_VOLUME_STANDALONE constants below
const SECONDARY_COMBINED_VOLUME_CHANGE_STEPS = 10; //TODO: Default to 0 or eliminate once we implement reading setting from codec

// To set the volume of the secondary codecs to a specific value when combined vs when standalone, set the
// SECONDARY_COMBINED_VOLUME_CHANGE_STEPS to 0 and specific the correct volume you wish to set the codec to using
// the SECONDARY_COMBINED_VOLUME_COMBINED and SECONDARY_COMBINED_VOLUME_STANDALONE constants
const SECONDARY_COMBINED_VOLUME_COMBINED = 0;
const SECONDARY_COMBINED_VOLUME_STANDALONE = 0; //TODO: Implement reading setting from codec

// If you would like to use the speaker on the monitor 1 in the secondary room, set SECONDARY_USE_MONITOR_AUDIO to true
// otherwise the macro will turn off Audio on that connector
const SECONDARY_USE_MONITOR_AUDIO = false;

/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ SECTION 4 - SECTION 4 - SECTION 4 - SECTION 4 - SECTION 4 - SECTION 4 +
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
General microphones and video sources for both primary and secondary codecs
 
The monitorMics, ethernetMics and usbMics arrays refer to locally connected microphones for which the macro will monitor vuMeter levels. 
The ID range for monitorMics is 1-8 since it refers to the physical analog mic input connectors on the codec.
The ID range for ethernetMics is 11-18, 21-28 an so forth until 81-88 since we support up to 8 ethernet mics with 8 
sub-ids each. So, for example , ethernec mic ID 12 as specified in this array refers to Ethernet Mic 1, sub-ID 2
The ID range for usbMics is 101-104 an maps to USB mic IDs 1-4 even though at the moment just one USB Mic input is supported (101)
The externalMics array refers to externally connected microphones where a controller sends the codec text messages over SSH or 
serial interface indicating which of those external microphones is currently active. 
The text message should be sent by the controller in the format “MIC_ACTIVE_XX” where XX is a distinct 
“microphone” id from 01 o 99. We are reserving 00 to indicate that there is relative silence in the room or that mute is active.
Even though the receiving of unformatted “MIC_ACTIVE_XX” type strings is supported, for better logging it is strongly 
recommended that the controller sends the message wrapped as an object as shown in the following examples. 
sending the MIC_ACTIVE_01 message via serial: 
xCommand Message Send Text: "{\x5C"App\x5C":\x5C"Crestron\x5C",\x5C"Source\x5C":{},\x5C"Type\x5C":\x5C"Command\x5C",\x5C"Value\x5C":\x5C"MIC_ACTIVE_01\x5C"}"\x0D\x0A  
sending the MIC_ACTIVE_01 message via SSH:  
xCommand Message Send Text: "{\"App\":\"Crestron\",\"Source\":{},\"Type\":\"Command\",\"Value\":\"MIC_ACTIVE_01\"}" 
NOTE: Any combination of microphone types specified in the monitorMics, ethernetMics , usbMics and externalMics is supported by
the macro, but given the differences in echo cancellation processing perfomed by the different microphone categories it is strongly
advised to stick to only one type of microphone to use for each installation. 
NOTE: See section 6 for PresenterTrack QA mode configuration and the PRESENTER_QA_AUDIENCE_MIC_IDS array 
*/

const config = {
  monitorMics: [1, 2], // (ex: [1, 2, 3, 4, 5, 6, 7, 8] ) analog input connectors (1-8) associated to microphones monitored
  ethernetMics: [], // (ex: 11, 12, 13, 14] ) IDs associated to Ethernet mics, up to 8 mics with 8 sub-ids: e.j. 12 is Ethernet Mic 1, sub-ID 2. 
  usbMics: [], // (ex: [101]) Mic input connectors associated to the USB microphones being used in the main codec: 101 is USB Mic 1
  externalMics: [], //  (ex: [901, 902]) input ids associated to microphones connected to an external controller received as message format MIC_ACTIVE_XX where XX is an external mic id 01-99
  compositions: [     // Create your array of compositions, if room role is JS_SECONDARY, these are for local cameras and AUX codecs only, no JS_SECONDARY source compositions allowed 
    {   // example for quadcam directly connected to connector 1 in main room 
      name: 'RoomMain',     // Name for your composition.  
      codecIP: '',        // No CodecIP needed if source is JS_LOCAL
      mics: [1, 2],    // Mics you want to associate with this composition. Example: [1, 2, 3]
      connectors: [1],    // Video input connector Ids to use
      source: JS_LOCAL,   // Always use JS_LOCAL in Primary or Secondary when referring to locally connected camera
      layout: 'Prominent',// Layout to use
      preset: 0           // use a camera preset instead of a layout with specific connectors.
    },
    {
      // NOTE: If you want to always show and overview shot irrespective of microphone input, just
      // set SIDE_BY_SIDE_TIME in section 5 below to 0 
      // Also, if you wish to show several presets in a composition or a combination of presets and 
      // non-preset camera or tie line video inputs, specify the presets to use in the preset key below
      // as an array (i.e. [11,12]) but also include the video connector ID for the cameras for those 
      // presets in the connectors array below in the right order so the macro knows how to lay them out in the composition
      // (i.e. connectors:[2,3,1,4] if the connectorID for the camera associated for preset 11 is 2, 
      // the connectorID for the camera associated for preset 12 is 3 and you want to also include input from quadcam
      // at connector 1 and video from tieline from secondary in connector 4 as the overview shot.)
      name: 'Overview',   // IMPORTANT: There needs to be an overview compositino with mics: [0]
      codecIP: '',        // No CodecIP needed if source is JS_LOCAL
      mics: [0],  // always just [0] for overview compositions
      connectors: [1], // Specify here the video inputs and order to use to compose the "overview" shot. Ex: [2,1] including those for preset related cameras
      source: JS_LOCAL,   // Overview composition always has source JS_LOCAL
      layout: 'Equal',       // Layout to use
      preset: 0 // use a camera preset instead of a layout with specific connectors. Specify a single preset or an array of preset Ids
      // NOTE: do not set preset to just one integer if you want more than one video input to be layed out, if you only
      // have one preset but still want to specify other connectos in the layout then specify and array of just one preset
      // (i.e. preset: [11] if only preset 11 will be used and connectors:[2,1,4] if you want to compose it input from the
      // camera doing the preset with connectors 1 and 4 as well.)
      // Setting preset to just one integeter will force it to ignore the connectors value
      // Set preset to 0 if no presets will be used. 
    }
  ]
};


// If you are using a SpeakerTrack 60, set QUAD_CAM_ID to the connector ID where the first camera of the array is connected 
// and also use that ID in the connetors array in the compositions above 
// If you are using a QuadCam, set this value to the connector ID being used for it.
// If you do not have any speakertracking capable cameras, just set this value to 0  
const QUAD_CAM_ID = 1;



// In RoomOS 11 there are multiple SpeakerTrack default behaviors to choose from on the navigator or
// Touch10 device. Set ST_DEFAULT_BEHAVIOR to the one you want this macro to use from these choices:
// Auto: The same as BestOverview.
// BestOverview: The default framing mode is Best overview. 
// Closeup: The default framing mode is Closeup (speaker tracking). 
// Current: The framing mode is kept unchanged when leaving a call. 
// Frames: The default framing mode is Frames.
const ST_DEFAULT_BEHAVIOR = 'Closeup';


/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ SECTION 5 - SECTION 5 - SECTION 5 - SECTION 5 - SECTION 5 - SECTION 5 +
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
TIMERS and THRESHOLDS
*/


// Time to wait for silence before setting Speakertrack Side-by-Side (Overview) mode
// set SIDE_BY_SIDE_TIME to 0 if you always want to show that mode
const SIDE_BY_SIDE_TIME = 10000; // 10 seconds
// Time to wait before switching to a new speaker
const NEW_SPEAKER_TIME = 2000; // 2 seconds
// Time to wait before activating automatic mode at the beginning of a call
const INITIAL_CALL_TIME = 15000; // 15 seconds

// WEBRTC_VIDEO_UNMUTE_WAIT_TIME only applies to RoomOS version 10 since
// have to to implement a woraround there to be able to switch cameras
// while in a WebRTC call. Values less than 1500 ms do not seem to work, but
// if you are having trouble getting switching to work in WebRTC calls you can increase
// this value although that will affect the overall experience since during this time
// the remote participants just see a black screen instead of the video feed.
const WEBRTC_VIDEO_UNMUTE_WAIT_TIME = 1500;

// Microphone High/Low Thresholds
const MICROPHONELOW = 6;
const MICROPHONEHIGH = 25;

/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ SECTION 6 - SECTION 6 - SECTION 6 - SECTION 6 - SECTION 6 - SECTION 6 +
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
Presenter Track Q&A Mode
*/

// ALLOW_PRESENTER_QA_MODE controls if the custom panel for activating PresenterTrack with or without 
// Q&A Mode is shown in the Touch10 or Navigator. Without it, you cannot activate PresenterTrack Q&A mode
const ALLOW_PRESENTER_QA_MODE = false;

//PRESENTER_QA_AUDIENCE_MIC_IDS is an array for Mic IDs that are being used for the audience. 
const PRESENTER_QA_AUDIENCE_MIC_IDS = [1, 2];


// PRESENTER_QA_KEEP_COMPOSITION_TIME is the time in ms that the macro will keep sending
// a composed image of the presenter and an audience member asking a question after the question
// has been asked by any audience member. If different audience members ask questions while the composition 
// is being shown after NEW_SPEAKER_TIME milliseconds have passed, the composition will change 
// to use that new audience member instead of the original. This will continue until no other audience members have
// spoken for PRESENTER_QA_KEEP_COMPOSITION_TIME milliseconds and then the code will resume sending only the 
// full video feed from the Presenter camera 
const PRESENTER_QA_KEEP_COMPOSITION_TIME = 7000

/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ DO NOT EDIT ANYTHING BELOW THIS LINE                                  +
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/


async function isCodecPro() {
  let ProductPlatform = await xapi.Status.SystemUnit.ProductPlatform.get()
  return (ProductPlatform == "Codec Pro")
}


async function secSendKeepAliveResponse() {
  // send message "VTC_KA_OK" to primary when received "VTC_KA_req"
  await sendIntercodecMessage("VTC_KA_OK");

}

// Validate config settings
async function validate_config() {
  let hasOverview = true;

  // only allow CodecPro or CodecEQ with advanced AV integrator option key
  const ProductPlatform = await xapi.Status.SystemUnit.ProductPlatform.get()
  if (ProductPlatform == "Room Kit EQ") {
    try {
      console.log(`Is Codec EQ`);
      const hasAVOptionInstalled = await xapi.Status.SystemUnit.Software.OptionKeys.AVIntegrator.get()
      if (hasAVOptionInstalled != 'True') {
        await disableMacro(`config validation fail: Platform ${ProductPlatform} without AV Integrator Option key not supported.`);
      }
    }
    catch (e) {
      await disableMacro(`config validation fail: Platform ${ProductPlatform} could not validate AV Option key.`);
    }
  }
  else if (ProductPlatform == "Codec Pro") {
    console.log(`Is Codec Pro`)
  }
  else {
    await disableMacro(`config validation fail: Platform ${ProductPlatform} not supported.`);
  }

  if (module.name.replace('./', '') != 'divisible_room_secondary')
    await disableMacro(`config validation fail: macro name has changed to: ${module.name.replace('./', '')}. Please set back to: divisible_room_secondary`);

  if (PRIMARY_CODEC_USER == '')
    await disableMacro(`config validation fail: OTHER_CODEC credentials must be set.  Current values: PRIMARY_CODEC_USER: ${PRIMARY_CODEC_USER} PRIMARY_CODEC_PASSWORD= ${PRIMARY_CODEC_PASSWORD}`);
  // allow up to 8 analog mics
  let allowedMics = [1, 2, 3, 4, 5, 6, 7, 8];

  let allowedEthernetMics = []
  // allow up to 8 ethernet mics with 8 lobes each
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      allowedEthernetMics.push((i * 10) + j)
    }
  }

  let allowedUSBMics = []
  // allow up to 4 USB mics
  for (let i = 1; i <= 4; i++) {
    allowedUSBMics.push(100 + i)
  }

  let allowedExternalMics = []
  // allow up to  99 External mics
  for (let i = 1; i <= 99; i++) {
    allowedExternalMics.push(900 + i)
  }

  // only allow up to 8 analog microphones
  if (config.monitorMics.length > 8)
    await disableMacro(`config validation fail: config.monitorMics can only have up to 8 entries. Current value: ${config.MonitorMics} `);
  // only allow up to 8 analog microphones
  if (config.ethernetMics.length > 64)
    await disableMacro(`config validation fail: config.ethernetMics can only have up to 64 entries. Current value: ${config.ethernetMics} `);
  // only allow up to 8 analog microphones
  if (config.usbMics.length > 4)
    await disableMacro(`config validation fail: config.usbMics can only have up to 4 entries. Current value: ${config.usbMics} `);
  if (config.externalMics.length > 99)
    await disableMacro(`config validation fail: config.externalMics can only have up to 99 entries. Current value: ${config.ethernetMics} `);

  if ((config.monitorMics.length + config.ethernetMics + config.usbMics.length + config.externalMics.length) < 1)
    await disableMacro(`config validation fail: there must be at least one microphone configured between config.monitorMics, config.ethernetMics and config.usbMics.`);


  // Check if using USB mic/input, that Echo control is turned on
  if (config.usbMics.length > 0) {
    const usbEchoControl = await xapi.config.Audio.Input.USBInterface[1].EchoControl.Mode.get()
    if (usbEchoControl != 'On')
      await disableMacro(`config validation fail: when using USB microphone input, Echo Control needs to be enabled. Only asynchronous USB devices are supported. Please enable and re-activate macro`);

  }

  // make sure the mics are within those specified in the monitorMics array
  if (!config.monitorMics.every(r => allowedMics.includes(r)))
    await disableMacro(`config validation fail: config.monitorMics can only have analog mic ids 1-8. Current value: ${config.monitorMics} `);

  if (!config.ethernetMics.every(r => allowedEthernetMics.includes(r)))
    await disableMacro(`config validation fail: config.ethernetMics can only include Ethernet mics 1-8(8 lobes each). Current value: ${config.ethernetMics} `);

  if (!config.usbMics.every(r => allowedUSBMics.includes(r)))
    await disableMacro(`config validation fail: config.usbMics can only include USB mics 1-4 (values 101-104). Current value: ${config.usbMics} `);

  if (!config.externalMics.every(r => allowedExternalMics.includes(r)))
    await disableMacro(`config validation fail: config.externalMics can only include external mics 01-99 (values 901-999). Current value: ${config.externalMics} `);

  // check for duplicates in config.monitorMics
  if (new Set(config.monitorMics).size !== config.monitorMics.length)
    await disableMacro(`config validation fail: config.monitorMics cannot have duplicates. Current value: ${config.monitorMics} `);
  if (new Set(config.ethernetMics).size !== config.ethernetMics.length)
    await disableMacro(`config validation fail: config.ethernetMics cannot have duplicates. Current value: ${config.ethernetMics} `);
  if (new Set(config.usbMics).size !== config.usbMics.length)
    await disableMacro(`config validation fail: config.usbMics cannot have duplicates. Current value: ${config.usbMics} `);

  // Check for valid audience mics CONFIGURED for the Presenter QA Mode feature
  if (ALLOW_PRESENTER_QA_MODE)
    if (!PRESENTER_QA_AUDIENCE_MIC_IDS.every(r => config.monitorMics.includes(r)) &&
      !PRESENTER_QA_AUDIENCE_MIC_IDS.every(r => config.ethernetMics.includes(r)) &&
      !PRESENTER_QA_AUDIENCE_MIC_IDS.every(r => config.externalMics.includes(r)) &&
      !PRESENTER_QA_AUDIENCE_MIC_IDS.every(r => config.usbMics.includes(r)))
      await disableMacro(`config validation fail: PRESENTER_QA_AUDIENCE_MIC_IDS can only specify values contained in config.monitorMics, config.ethernetMics or config.usbMics . Current values PRESENTER_QA_AUDIENCE_MIC_IDS: ${PRESENTER_QA_AUDIENCE_MIC_IDS}`);

  // all went well, can return true!
  return true;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function disableMacro(reason = 'N/A') {
  console.warn(reason)
  let act = `Disabling [${module.name.replace('./', '')}] in 10 seconds`
  console.error({ Error: reason, Action: act })
  await xapi.Command.UserInterface.Message.Alert.Display({ Title: '⚠️ Macro Error ⚠️', Text: `${reason}<p>${act}`, Duration: 9 });
  await delay(10000);
  await xapi.Command.Macros.Macro.Deactivate({ Name: module.name.replace('./', '') });
  await delay(100);
  await xapi.Command.Macros.Runtime.Restart();
}

async function checkOverviewPreset() {
  console.log('Checking for existence of preset 30')
  let pre_list = await xapi.Command.Camera.Preset.List(
    { CameraId: 1 })
  let pre_exists = false;
  if ('Preset' in pre_list) {
    pre_list.Preset.forEach(preObj => {
      if (preObj.PresetId == '30') pre_exists = true;
    })
  }
  if (!pre_exists) {
    console.log('Preset 30 does not exist, need to create it....')
    await xapi.Command.Camera.PositionReset({ CameraId: 1 });
    await delay(1000);
    await xapi.Command.Camera.Preset.Store(
      { CameraId: 1, Name: "Overview", PresetId: 30 });
    console.log('Preset 30 created')
  }
}






//Declare your object for GMM communication
var primaryCodec = {};

//Run your init script asynchronously 
async function init_intercodec() {
  if (PRIMARY_CODEC_USER != '') {
    if (PRIMARY_BOT_TOKEN == '' && ALLOW_INSECURE_HTTPS)
      primaryCodec = new GMM.Connect.IP(PRIMARY_CODEC_USER, PRIMARY_CODEC_PASSWORD, PRIMARY_CODEC_ADDRESS);
    else if (PRIMARY_BOT_TOKEN == '' && !ALLOW_INSECURE_HTTPS)
      primaryCodec = new GMM.Connect.HTTPS(PRIMARY_CODEC_USER, PRIMARY_CODEC_PASSWORD, PRIMARY_CODEC_ADDRESS);
    else
      primaryCodec = new GMM.Connect.Webex(PRIMARY_BOT_TOKEN, PRIMARY_CODEC_ADDRESS);
  }

}

const localCallout = new GMM.Connect.Local(module.name.replace('./', ''))

/////////////////////////////////////////////////////////////////////////////////////////
// VARIABLES
/////////////////////////////////////////////////////////////////////////////////////////


// roomCombined keeps the current state of join/split for the codec. It is normally also reflected in 
// permanent storage (GMMMemory macro) in the JoinSplit_combinedState global
var roomCombined = false;

// on a secondary codec, secondarySelected reflects if it has been selected for joining from the primary or not. It is kept in persistent 
// storage in the JoinSplit_secondarySelected key
var secondarySelected = true;


// below we are just initializing JoinSplit_secondary_settings, no need to fill out values
var JoinSplit_secondary_settings = {
  UltrasoundMax: 0,
  WakeupOnMotionDetection: '',
  StandbyControl: '',
  VideoMonitors: ''
}


let micArrays = {};
for (var i in config.monitorMics) {
  micArrays[config.monitorMics[i].toString()] = [0, 0, 0, 0];
}
for (var i in config.ethernetMics) {
  micArrays[config.ethernetMics[i].toString()] = [0, 0, 0, 0];
}
for (var i in config.usbMics) {
  micArrays[config.usbMics[i].toString()] = [0, 0, 0, 0];
}

let lowWasRecalled = false;
let lastActiveHighInput = 0;
let lastSourceDict = { SourceID: '1' }
let allowSideBySide = true;
let sideBySideTimer = null;
let InitialCallTimer = null;
let allowCameraSwitching = false;
let allowNewSpeaker = true;
let newSpeakerTimer = null;
let manual_mode = true;

let primarySingleScreen = false;

let micHandler = () => void 0;
let micHandlerEthernet = () => void 0;
let micHandlerUSB = () => void 0;

let overviewShowDouble = true; //Always setting overviewShowDouble to true so we always evaluate the overview composition now
let inSideBySide = false;

let presenterTracking = false;
let presenterDetected = true;
let presenterTrackConfigured = false;
let presenterQAKeepComposition = false;
let qaCompositionTimer = null;

let usb_mode = false;
let webrtc_mode = false;

let primaryInCall = false;

let primaryInPreview = false;

let secondariesStatus = {};
let connector_to_codec_map = {}



let PRESENTER_QA_MODE = false

let ST_ACTIVE_CONNECTOR = 0;

let macroTurnedOnST = false;
let macroTurnedOffST = false;

let isOSTen = false;
let isOSEleven = false;



// Initial check for the Video Monitor configuration
async function check4_Video_Monitor_Config() {
  const videoMonitorConfig = await xapi.Config.Video.Monitors.get()
  return new Promise((resolve, reject) => {
    if (videoMonitorConfig != 'Auto' && (videoMonitorConfig != 'Triple' && videoMonitorConfig != 'TriplePresentationOnly')) {
      resolve(videoMonitorConfig)
    } else {
      reject(new Error('xConfiguration Video Monitors can not be set to Auto, Triple or TriplePresentationOnly for the Join/Split macro to work properly'))
    }
  })
}

async function getPresetCamera(prID) {
  const value = await xapi.Command.Camera.Preset.Show({ PresetId: prID });
  return (value.CameraId)
}

async function check4_Minimum_Version_Required(minimumOs) {
  const reg = /^\D*(?<MAJOR>\d*)\.(?<MINOR>\d*)\.(?<EXTRAVERSION>\d*)\.(?<BUILDID>\d*).*$/i;
  const minOs = minimumOs;
  const os = await xapi.Status.SystemUnit.Software.Version.get();
  console.log(os)
  const x = (reg.exec(os)).groups;
  const y = (reg.exec(minOs)).groups;
  if (parseInt(x.MAJOR) > parseInt(y.MAJOR)) return true;
  if (parseInt(x.MAJOR) < parseInt(y.MAJOR)) return false;
  if (parseInt(x.MINOR) > parseInt(y.MINOR)) return true;
  if (parseInt(x.MINOR) < parseInt(y.MINOR)) return false;
  if (parseInt(x.EXTRAVERSION) > parseInt(y.EXTRAVERSION)) return true;
  if (parseInt(x.EXTRAVERSION) < parseInt(y.EXTRAVERSION)) return false;
  if (parseInt(x.BUILDID) > parseInt(y.BUILDID)) return true;
  if (parseInt(x.BUILDID) < parseInt(y.BUILDID)) return false;
  return false;
}


async function setCombinedMode(combinedValue) {
  roomCombined = combinedValue;
  await GMM.write.global('JoinSplit_combinedState', roomCombined).then(() => {
    console.log({ Message: 'ChangeState', Action: 'Combined state stored.' })
  })

}
async function storeSecondarySettings(ultraSoundMaxValue, wState, sState) {
  let currentVideoMonitors = await xapi.Config.Video.Monitors.get();
  if (currentVideoMonitors != 'Triple') { // only store if going from split to combined... if currentVideoMonitors=='Triple' then rooms are combined!!
    JoinSplit_secondary_settings.UltrasoundMax = ultraSoundMaxValue;
    JoinSplit_secondary_settings.WakeupOnMotionDetection = wState;
    JoinSplit_secondary_settings.StandbyControl = sState;
    JoinSplit_secondary_settings.VideoMonitors = currentVideoMonitors;
    await GMM.write.global('JoinSplit_secondary_settings', JoinSplit_secondary_settings).then(() => {
      console.log({ Message: 'ChangeState', Action: 'secondary settings for Ultrasound, WakeupOnMotionDetection , StandbyControl and VideoMonitors stored.' })
    });
  }
}



/**
  * This will initialize the room state to Combined or Divided based on the setting in Memory Macro (persistent storage)
**/
async function initialCombinedJoinState() {
  // Change all these to whatever is needed to trigger on the Primary when it goes into combined
  if (roomCombined) {
    console.log('Room is in Combined Mode');

    setCombinedMode(true);
  } else {
    console.log('Room is in Divided Mode');
    setCombinedMode(false);
  }
}


/**
  * This will initialize the room state to Combined or Divided based on the Pin 4 set by Primary
**/
async function checkCombinedStateSecondary() {
  if (USE_GPIO_INTERCODEC) Promise.all([xapi.status.get('GPIO Pin 4')]).then(promises => {
    let [pin4] = promises;
    console.log('Pin4: ' + pin4.State);
    // Change all these to whatever is needed to trigger on the Secondary when it goes into combined
    if (pin4.State === 'Low' && (!secondarySelected)) {
      console.log('Secondary Room is in Combined Mode');
      setSecondaryToCombined();
    } else {
      if (!secondarySelected) console.log('Secondary Room is not selected in Primary...');
      console.log('Secondary Room is in Divided Mode');
      setSecondaryToSplit();
      // since we are in secondary codec and in split configuration, we need to 
      // prepare to do basic switching to support PresenterTrack QA mode. 
      init_switching();
    }
  }).catch(e => console.debug(e));
  else { // not using GPIO PINs
    if (roomCombined) {
      console.log('Secondary was set to Combined Mode in permanent storage');
      setSecondaryToCombined();
    }
    else {
      console.log('Secondary set to Divided Mode in permanent storage');
      setSecondaryToSplit();
    }
  }
}

/**
  * The following functions display a message on the touch panel to alert the users
  * that the rooms are either being separated or joined together
**/
function alertJoinedScreen() {
  xapi.command('UserInterface Message Alert Display', {
    Title: 'Combining Rooms ...',
    Text: 'Please wait',
    Duration: 10,
  });
}

function alertSplitScreen() {
  xapi.command('UserInterface Message Alert Display', {
    Title: 'Dividing Rooms ...',
    Text: 'Please wait',
    Duration: 10,
  });
}





/////////////////////////////////////////////////////////////////////////////////////////
// DEFAULT ENDPOINT CONFIGURATIONS
// UPON SYSTEM STARTUP, these configurations should be run, They set a baseline for
// settings that we do not want the users to change.
/////////////////////////////////////////////////////////////////////////////////////////


async function setSecondaryDefaultConfig() {

  console.log("Secondary default config being run");

  // no longer will we store the VideoMonitors settings and others below when
  // setting default config since that was storing wrong values when initializing in combined mode.
  // we only store them when we are going to combined Mode to keep track of what they were initially when split
  /*
    //grab current secondary settings to store away in GMM  
    let ultraSoundMaxValue = await xapi.Config.Audio.Ultrasound.MaxVolume.get()
    let standbyWakeupMotionValue=await xapi.Config.Standby.WakeupOnMotionDetection.get()
    let standbyControlValue=await xapi.Config.Standby.Control.get()
  
    // store it them in persistent storage, this also reads 
    // current JoinSplit_secondary_settings.VideoMonitors from codec
   await storeSecondarySettings(ultraSoundMaxValue, standbyWakeupMotionValue, standbyControlValue);
  */

  if (await isCodecPro()) {
    xapi.config.set('Audio Input ARC 1 Mode', 'Off')
      .catch((error) => { console.error("1" + error); });
    xapi.config.set('Audio Input ARC 2 Mode', 'Off')
      .catch((error) => { console.error("2" + error); });
    xapi.config.set('Audio Input ARC 3 Mode', 'Off')
      .catch((error) => { console.error("3" + error); });
  }

  // HDMI AUDIO SECTION
  if (await isCodecPro()) xapi.Config.Audio.Output.ConnectorSetup.set('Manual');
  xapi.config.set('Audio Input HDMI 1 Mode', 'Off')
    .catch((error) => { console.error("4" + error); });
  xapi.config.set('Audio Input HDMI 2 Mode', 'Off')
    .catch((error) => { console.error("5" + error); });

  xapi.Config.Audio.Input.HDMI[SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID].Mode.set('On')
    .catch((error) => { console.error("5" + error); });;

  // This allows us of USB Passthrough

  // SET MICROPHONES
  // MICROPHONES 1 THRU 8 ARE USER CONFIGURABLE
  // THIS NEW VERSION 2 DESIGN USES EMBEDDED HDMI AUDIO FROM PRIMARY TO SECONDARY

  // MUTE
  xapi.config.set('Audio Microphones Mute Enabled', 'True')
    .catch((error) => { console.error("21" + error); });

  // OUTPUT ARC SECTION (FOR QUAD CAMERA ONLY)
  xapi.config.set('Audio Output ARC 1 Mode', 'On')
    .catch((error) => { console.error("22" + error); }); //TODO: This need to be turned off if you do not want to use the speakers on the QuadCam

  // HDMI AUDIO OUTPUT
  if (!SECONDARY_USE_MONITOR_AUDIO)
    xapi.config.set('Audio Output HDMI 1 Mode', 'Off')
      .catch((error) => { console.error("23" + error); });
  xapi.config.set('Audio Output HDMI 2 Mode', 'Off')
    .catch((error) => { console.error("24" + error); });
  xapi.config.set('Audio Output HDMI 3 Mode', 'On')
    .catch((error) => { console.error("25" + error); });
  // This allows use of USB Passthrough

  // CONFERENCE
  xapi.config.set('Conference AutoAnswer Mode', 'Off')
    .catch((error) => { console.error("36" + error); });


  if (await isCodecPro()) {
    // GPIO
    if (USE_GPIO_INTERCODEC) {
      xapi.config.set('GPIO Pin 2 Mode', 'InputNoAction')
        .catch((error) => { console.error("39" + error); });
      xapi.config.set('GPIO Pin 3 Mode', 'InputNoAction')
        .catch((error) => { console.error("40" + error); });
      xapi.config.set('GPIO Pin 4 Mode', 'InputNoAction')
        .catch((error) => { console.error("41" + error); });
    }
  }


  // PERIPHERALS
  xapi.config.set('Peripherals Profile Cameras', 'Minimum1')
    .catch((error) => { console.error("44" + error); });
  xapi.config.set('Peripherals Profile TouchPanels', 'Minimum1')
    .catch((error) => { console.error("45" + error); });

  // SERIAL PORT
  xapi.config.set('SerialPort LoginRequired', 'Off')
    .catch((error) => { console.error("46" + error); });
  xapi.config.set('SerialPort Mode', 'On')
    .catch((error) => { console.error("47" + error); });


  // VIDEO
  xapi.config.set('Video DefaultMainSource', '1')
    .catch((error) => { console.error("50" + error); });
  //xapi.config.set('Video Monitors', JoinSplit_secondary_settings.VideoMonitors)
  //  .catch((error) => { console.error("51"+error); });
  xapi.command('Video Input SetMainVideoSource', { ConnectorID: 1 })
    .catch((error) => { console.error("52" + error); });


  // VIDEO INPUT SECTION
  // HDMI INPUT 1
  xapi.config.set('Video Input Connector 1 CameraControl CameraId', '1')
    .catch((error) => { console.error("54" + error); });
  xapi.config.set('Video Input Connector 1 CameraControl Mode', 'On')
    .catch((error) => { console.error("55" + error); });
  xapi.config.set('Video Input Connector 1 InputSourceType', 'camera')
    .catch((error) => { console.error("56" + error); });
  xapi.config.set('Video Input Connector 1 Name', 'Quad Camera')
    .catch((error) => { console.error("57" + error); });
  xapi.config.set('Video Input Connector 1 PreferredResolution', '1920_1080_60')
    .catch((error) => { console.error("58" + error); });
  xapi.config.set('Video Input Connector 1 PresentationSelection', 'Manual')
    .catch((error) => { console.error("59" + error); });
  xapi.config.set('Video Input Connector 1 Quality', 'Motion')
    .catch((error) => { console.error("60" + error); });
  xapi.config.set('Video Input Connector 1 Visibility', 'Never')
    .catch((error) => { console.error("61" + error); });


  // Usually HDMI INPUTS 3 AND 4
  // THESE ARE SCREENS 1 AND 2 FROM THE PRIMARY ROOM
  xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID + ' HDCP Mode', 'Off')
    .catch((error) => { console.error("62" + error); });
  xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID + ' CameraControl Mode', 'Off')
    .catch((error) => { console.error("63" + error); });
  xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID + ' InputSourceType', 'Other')
    .catch((error) => { console.error("64" + error); });
  xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID + ' Name', 'Main Video Primary')
    .catch((error) => { console.error("65" + error); });
  xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID + ' PreferredResolution', '3840_2160_30')
    .catch((error) => { console.error("66" + error); });
  xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID + ' PresentationSelection', 'Manual')
    .catch((error) => { console.error("67" + error); });
  xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID + ' Quality', 'Sharpness')
    .catch((error) => { console.error("68" + error); });
  xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID + ' Visibility', 'Never')
    .catch((error) => { console.error("69" + error); });

  if (JoinSplit_secondary_settings.VideoMonitors == 'Dual' || JoinSplit_secondary_settings.VideoMonitors == 'DualPresentationOnly') {
    xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID + ' HDCP Mode', 'Off')
      .catch((error) => { console.error("70" + error); });
    xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID + ' CameraControl Mode', 'Off')
      .catch((error) => { console.error("71" + error); });
    xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID + ' InputSourceType', 'PC')
      .catch((error) => { console.error("72" + error); });
    xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID + ' Name', 'Content Primary')
      .catch((error) => { console.error("73" + error); });
    xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID + ' PreferredResolution', '3840_2160_30')
      .catch((error) => { console.error("74" + error); });
    xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID + ' PresentationSelection', 'Manual')
      .catch((error) => { console.error("75" + error); });
    xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID + ' Quality', 'Sharpness')
      .catch((error) => { console.error("76" + error); });
    xapi.config.set('Video Input Connector ' + SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID + ' Visibility', 'Never')
      .catch((error) => { console.error("77" + error); });
  }

  // HDMI INPUT 2 (PRESENTER CAMERA) and 5 SHOULD BE CONFIGURED FROM THE WEB INTERFACE
  // SDI INPUT 6 SHOULD ALSO BE CONFIGURED FROM THE WEB INTERFACE
  // SDI INPUT 6 CAN BE USED FOR AN ADDITIONAL PTZ CAMERA (BUT NOT THE PRESENTER CAMERA)

  // VIDEO OUTPUT SECTION
  // THESE SHOULD NOT BE CONFIGURED BY THE INSTALLER
  JoinSplit_secondary_settings.VideoMonitors = await xapi.Config.Video.Monitors.get()

  switch (JoinSplit_secondary_settings.VideoMonitors) {
    case 'Dual':
      xapi.Config.Video.Output.Connector[1].MonitorRole.set('First');
      xapi.Config.Video.Output.Connector[2].MonitorRole.set('Second');
      break;
    case 'DualPresentationOnly':
      xapi.Config.Video.Output.Connector[1].MonitorRole.set('First');
      xapi.Config.Video.Output.Connector[2].MonitorRole.set('PresentationOnly');
      break;
    case 'Single':
      xapi.Config.Video.Output.Connector[1].MonitorRole.set('First');
      xapi.Config.Video.Output.Connector[2].MonitorRole.set('First');
      break;
  }

  xapi.config.set('Video Output Connector 3 MonitorRole', 'Third')
    .catch((error) => { console.error("82" + error); });
  xapi.config.set('Video Output Connector 3 Resolution', 'Auto')
    .catch((error) => { console.error("83" + error); });

  xapi.command('Video Matrix Reset')
    .catch((error) => { console.error("84" + error); });
}

/////////////////////////////////////////////////////////////////////////////////////////
// START/STOP AUTOMATION FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////

async function startAutomation() {
  console.log('startAutomation');

  //setting overall manual mode to false
  manual_mode = false;
  allowCameraSwitching = true;

  if (inSideBySide) {
    var currentSTCameraID = QUAD_CAM_ID;
    let sourceDict = { SourceID: '0' }
    sourceDict["SourceID"] = currentSTCameraID.toString();
    xapi.Command.Video.Input.SetMainVideoSource(sourceDict);
    inSideBySide = false;
    console.log("cleared out side by side mode....")
  }

  try {
    const webViewType = await xapi.Status.UserInterface.WebView.Type.get()
    if (webViewType == 'WebRTCMeeting') webrtc_mode = true;
  } catch (e) {
    console.log('Unable to read WebView Type.. assuming not in webrtc mode')
  }

  if (isOSEleven) {
    xapi.Config.Cameras.SpeakerTrack.DefaultBehavior.set(ST_DEFAULT_BEHAVIOR);
    if (ST_DEFAULT_BEHAVIOR == 'Frames') xapi.Command.Cameras.SpeakerTrack.Frames.Activate();
    else {
      xapi.Command.Cameras.SpeakerTrack.Frames.Deactivate();
      if (ST_DEFAULT_BEHAVIOR == 'Closeup') xapi.Config.Cameras.SpeakerTrack.Closeup.set('On');
    }
  }

  // Always turn on SpeakerTrack when the Automation is started. It is also turned on when a call connects so that
  // if it is manually turned off while outside of a call it goes back to the correct state
  macroTurnedOnST = true;
  if (webrtc_mode) {
    setTimeout(() => { xapi.Command.Cameras.SpeakerTrack.Activate().catch(handleError) }, 2000) // in RoomOS11 Beta, if we do not delay turning on ST, something turns it back off
  } else xapi.Command.Cameras.SpeakerTrack.Activate().catch(handleError);

  // only initialize vumeters if side by side timer (overview timer) is not zero
  // because, if zero, that means we will always be showing side by side (overview) mode
  // and never need to switch to a specific camera
  if (SIDE_BY_SIDE_TIME > 0) {
    //registering vuMeter event handler for analog mics
    if (config.monitorMics.length > 0) {
      micHandler();
      micHandler = () => void 0;
      micHandler = xapi.event.on('Audio Input Connectors Microphone', (event) => {
        if (typeof micArrays[event.id[0]] != 'undefined' && (!CHK_VUMETER_LOUDSPEAKER || event.LoudspeakerActivity < 1)) {
          micArrays[event.id[0]].shift();
          micArrays[event.id[0]].push(event.VuMeter);

          // checking on manual_mode might be unnecessary because in manual mode,
          // audio events should not be triggered
          if (manual_mode == false) {
            // invoke main logic to check mic levels ans switch to correct camera input
            checkMicLevelsToSwitchCamera();
          }
        }
      });
    }


    //registering vuMeter event handler for Ethernet mics
    if (config.ethernetMics.length > 0) {
      micHandlerEthernet();
      micHandlerEthernet = () => void 0;
      micHandlerEthernet = xapi.event.on('Audio Input Connectors Ethernet', (event) => {
        //console.log(event)
        event.SubId.forEach(submic => {
          if (typeof micArrays[event.id + submic.id] != 'undefined') {
            micArrays[event.id + submic.id].shift();
            micArrays[event.id + submic.id].push(submic.VuMeter);
            if (manual_mode == false) {
              // invoke main logic to check mic levels ans switch to correct camera input
              checkMicLevelsToSwitchCamera();
            }
          }
        })

      });
    }


    //registering vuMeter event handler for USB mics
    if (config.usbMics.length > 0) {
      micHandlerUSB();
      micHandlerUSB = () => void 0;
      micHandlerUSB = xapi.event.on('Audio Input Connectors USBMicrophone', (event) => {
        //console.log(event)
        if (typeof micArrays['10' + event.id] != 'undefined') {
          micArrays['10' + event.id].shift();
          micArrays['10' + event.id].push(event.VuMeter);

          // checking on manual_mode might be unnecessary because in manual mode,
          // audio events should not be triggered
          if (manual_mode == false) {
            // invoke main logic to check mic levels ans switch to correct camera input
            checkMicLevelsToSwitchCamera();
          }
        }
      });
    }


    // start VuMeter monitoring
    console.log("Turning on VuMeter monitoring...")
    for (var i in config.monitorMics) {
      xapi.command('Audio VuMeter Start', {
        ConnectorId: config.monitorMics[i],
        ConnectorType: 'Microphone',
        IntervalMs: 500,
        Source: 'AfterAEC'
      });
    }


    let ethernetMicsStarted = [];
    for (var i in config.ethernetMics) {
      if (!ethernetMicsStarted.includes(parseInt(config.ethernetMics[i] / 10))) {
        ethernetMicsStarted.push(parseInt(config.ethernetMics[i] / 10));
        xapi.Command.Audio.VuMeter.Start(
          {
            ConnectorId: parseInt(config.ethernetMics[i] / 10),
            ConnectorType: 'Ethernet',
            IncludePairingQuality: 'Off',
            IntervalMs: 500,
            Source: 'AfterAEC'
          });
      }
    }


    for (var i in config.usbMics) {
      xapi.Command.Audio.VuMeter.Start(
        {
          ConnectorId: config.usbMics[i] - 100,
          ConnectorType: 'USBMicrophone',
          IncludePairingQuality: 'Off',
          IntervalMs: 500,
          Source: 'AfterAEC'
        });
    }
  }
}

function stopAutomation() {
  //setting overall manual mode to true
  manual_mode = true;
  stopSideBySideTimer();
  stopNewSpeakerTimer();
  stopInitialCallTimer();
  console.log("Stopping all VuMeters...");
  xapi.Command.Audio.VuMeter.StopAll({});

  if (inSideBySide) {
    var currentSTCameraID = QUAD_CAM_ID;
    let sourceDict = { SourceID: '0' }
    sourceDict["SourceID"] = currentSTCameraID.toString();
    xapi.Command.Video.Input.SetMainVideoSource(sourceDict);
    inSideBySide = false;
    console.log("cleared out side by side mode....")
  }

  // set tie line back to primary to local QuadCam just as when initially configured
  // if secondary in combined mode since we now matrix in current main video source
  // when automation is turned on
  if (true && roomCombined)
    xapi.command('Video Matrix Assign', { Output: SECONDARY_VIDEO_TIELINE_OUTPUT_TO_PRI_SEC_ID, SourceID: 1 }).catch((error) => { console.error(error); });

  /*
  console.log("Switching to MainVideoSource connectorID 1 ...");
  //pauseSpeakerTrack(); // in case it is turned on so we can switch video sources
  if (webrtc_mode && !isOSEleven) xapi.Command.Video.Input.MainVideo.Mute();
  xapi.Command.Video.Input.SetMainVideoSource({ SourceId: 1});
  lastSourceDict={ SourceId: 1};
  if (webrtc_mode && !isOSEleven) setTimeout( function(){xapi.Command.Video.Input.MainVideo.Unmute()} , WEBRTC_VIDEO_UNMUTE_WAIT_TIME);
  //resumeSpeakerTrack(); // in case speaker track is active so we turn off BG mode.
  */
  // using proper way to de-register handlers
  micHandler();
  micHandler = () => void 0;
  micHandlerEthernet();
  micHandlerEthernet = () => void 0;
  micHandlerUSB();
  micHandlerUSB = () => void 0;
}



/////////////////////////////////////////////////////////////////////////////////////////
// MICROPHONE DETECTION AND CAMERA SWITCHING LOGIC FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////

function checkMicLevelsToSwitchCamera() {
  // make sure we've gotten enough samples from each mic in order to do averages
  if (allowCameraSwitching) {
    // figure out which of the inputs has the highest average level then perform logic for that input *ONLY* if allowCameraSwitching is true
    let array_key = largestMicValue();
    let array = [];
    array = micArrays[array_key];
    // get the average level for the currently active input
    let average = averageArray(array);
    //get the input number as an int since it is passed as a string (since it is a key to a dict)
    let input = parseInt(array_key);
    // someone is speaking
    if (average > MICROPHONEHIGH) {
      // start timer to prevent Side-by-Side mode too quickly
      restartSideBySideTimer();
      if (input > 0) {
        lowWasRecalled = false;
        // no one was talking before
        if (lastActiveHighInput === 0) {
          makeCameraSwitch(input, average);
        }
        // the same person is talking
        else if (lastActiveHighInput === input) {
          restartNewSpeakerTimer();
        }
        // a different person is talking
        else if (lastActiveHighInput !== input) {
          if (allowNewSpeaker) {
            makeCameraSwitch(input, average);
          }
        }
      }
    }
    // no one is speaking
    else if (average < MICROPHONELOW) {
      // only trigger if enough time has elapsed since someone spoke last
      if (allowSideBySide) {
        if (input > 0 && !lowWasRecalled) {
          lastActiveHighInput = 0;
          lowWasRecalled = true;
          console.log("-------------------------------------------------");
          console.log("Low Triggered");
          console.log("-------------------------------------------------");
          recallSideBySideMode();
        }
      }
    }

  }
}


function processExternalMicHandler(activeMic) {
  // activeMic should contain a string with a external mic ID (00-99) passed along by the 
  // controller via MIC_ACTIVE_XX for us to trigger the switching functionality
  // we need to prepend the '9' character to it before parsing it into the integer for 
  // input so we can indicate it is an external mic specified in the config.externaMics array 
  let input = parseInt('9' + activeMic)
  let average = 0;
  if (allowCameraSwitching && !manual_mode) {
    // simulate valide average to trigger switch since controller already made decision
    if (input > 900) {
      average = MICROPHONEHIGH + 1;
    }
    else {
      average = MICROPHONELOW - 1;
      input = 1; // need to simulate that there were valid mic readings
    }

    // someone is speaking
    if (average > MICROPHONEHIGH) {
      // start timer to prevent Side-by-Side mode too quickly
      restartSideBySideTimer();
      if (input > 900) {
        lowWasRecalled = false;
        // no one was talking before
        if (lastActiveHighInput === 0) {
          makeCameraSwitch(input, average);
        }
        // the same person is talking
        else if (lastActiveHighInput === input) {
          restartNewSpeakerTimer();
        }
        // a different person is talking
        else if (lastActiveHighInput !== input) {
          if (allowNewSpeaker) {
            makeCameraSwitch(input, average);
          }
        }
      }
    }
    // no one is speaking
    else if (average < MICROPHONELOW) {
      // only trigger if enough time has elapsed since someone spoke last
      if (allowSideBySide) {
        if (input > 0 && !lowWasRecalled) {
          lastActiveHighInput = 0;
          lowWasRecalled = true;
          console.log("-------------------------------------------------");
          console.log("External Mic Low Triggered");
          console.log("-------------------------------------------------");
          recallSideBySideMode();
        }
      }
    }

  }
}


// function to actually switch the camera input
async function makeCameraSwitch(input, average) {
  console.log("-------------------------------------------------");
  console.log("High Triggered: ");
  console.log(`Input = ${input} | Average = ${average}`);
  console.log(`roomCombined = ${roomCombined}`);
  console.log("-------------------------------------------------");

  // map the loudest mic to the corresponding composition which could be local or from a 
  // secondary codec.
  var currentSTCameraID = QUAD_CAM_ID;
  let sourceDict = { SourceID: '0' } // Just initialize
  let initial_sourceDict = { SourceID: '0' } // to be able to compare later
  config.compositions.forEach(compose => {
    if (compose.mics.includes(input)) {

      console.log(`Setting to composition = ${compose.name}`);
      if (compose.preset != 0) {
        console.log(`Setting Video Input to preset [${compose.preset}] `);
        sourceDict = { PresetId: compose.preset };
        //xapi.Command.Camera.Preset.Activate(sourceDict);
      }
      else {
        console.log(`Setting Video Input to connectors [${compose.connectors}] and Layout: ${compose.layout}`);
        sourceDict = { ConnectorId: compose.connectors, Layout: compose.layout }
      }
    }
  })



  if (presenterTracking && presenterDetected) {
    // if we have selected Presenter Q&A mode and the codec is currently in presenterTrack mode, invoke
    // that specific camera switching logic contained in presenterQASwitch()
    if (PRESENTER_QA_MODE && !webrtc_mode) presenterQASwitch(input, sourceDict);
    // if the codec is in presentertracking but not in PRESENTER_QA_MODE , simply ignore the request to switch
    // cameras since we need to keep sending the presenterTrack camera. 
    inSideBySide = false; // if presenterTracking, this should never be on, but clearing just in case
  }
  else if (JSON.stringify(lastSourceDict) != JSON.stringify(sourceDict)) {
    if (JSON.stringify(sourceDict) == JSON.stringify(initial_sourceDict)) {
      console.warn(`makeCameraSwitch(): Active mic did not match any composition and not in PresentarTrack mode... `)
      restartNewSpeakerTimer();
      return;
    }

    if (webrtc_mode && !isOSEleven) xapi.Command.Video.Input.MainVideo.Mute();

    inSideBySide = false;

    // the Video Input SetMainVideoSource does not work while Speakertrack is active
    // so we need to turn it off in case the previous video input was from a source where
    // SpeakerTrack is used.
    pauseSpeakerTrack();

    // Switch to the source that is speficied in the same index position in MAP_CAMERA_SOURCE_IDS
    //console.log("Switching to input with SetMainVideoSource with dict: ", sourceDict  )
    //xapi.command('Video Input SetMainVideoSource', sourceDict).catch(handleError);

    // Apply the composition for active mic
    //console.log(`Switching to ${sourceDict} `)
    console.log(`Switching to ${JSON.stringify(sourceDict)}`)
    if ('PresetId' in sourceDict) xapi.Command.Camera.Preset.Activate(sourceDict)
    else xapi.Command.Video.Input.SetMainVideoSource(sourceDict);

    lastSourceDict = sourceDict;

    if (('ConnectorId' in sourceDict) && sourceDict['ConnectorId'].includes(currentSTCameraID)) {
      resumeSpeakerTrack();
    }

    lastActiveHighInput = input;
    restartNewSpeakerTimer();
    if (webrtc_mode && !isOSEleven) setTimeout(function () { xapi.Command.Video.Input.MainVideo.Unmute() }, WEBRTC_VIDEO_UNMUTE_WAIT_TIME);

  }
}

// function to actually switch the camera input when in presentertrack Q&A mode
async function presenterQASwitch(input, sourceDict) {

  if (!(PRESENTER_QA_AUDIENCE_MIC_IDS.includes(input))) {
    // Once the presenter starts talkin, we need to initiate composition timer
    // to remove composition only after the configured time has passed.
    restartCompositionTimer();
  }
  else if (lastActiveHighInput != input) {
    // here we need to compose presenter with other camera where someone is speaking
    if ('ConnectorId' in sourceDict && sourceDict['ConnectorId'].length == 1) {
      let presenterSource = await xapi.Config.Cameras.PresenterTrack.Connector.get();
      let connectorDict = { ConnectorId: [presenterSource, sourceDict['ConnectorId'][0]] };
      console.log("Trying to use this for connector dict in presenterQASwitch(): ", connectorDict)

      setComposedQAVideoSource(connectorDict);

      // Restart the timer that tells how long to keep the composition for when the same
      // person is asking questions or the presenter is talking
      //restartCompositionTimer();

      // Actually, when audience members speak, we must stop the composition
      // timer since only silence or speaker speaking should start it!
      stopCompositionTimer();
    } else {
      console.log(`Trying to use ${sourceDict} in presenterQASwitch() but is preset or multiple connectors, should be just 1 ConnectorId`);
      return;
    }

  }




  lastActiveHighInput = input;
  restartNewSpeakerTimer();
}

function setComposedQAVideoSource(connectorDict) {

  if (webrtc_mode && !isOSEleven) xapi.Command.Video.Input.MainVideo.Mute();

  // always put speakertrack on background mode when switching around inputs 
  pauseSpeakerTrack();

  console.log("In setComposedQAVideoSource() switching to input with SetMainVideoSource with dict: ", connectorDict)
  xapi.command('Video Input SetMainVideoSource', connectorDict).catch(handleError);
  lastSourceDict = connectorDict;

  const payload = { EditMatrixOutput: { sources: connectorDict["ConnectorId"] } };

  setTimeout(function () {
    //Let USB Macro know we are composing
    localCallout.command(payload).post()
  }, 250) //250ms delay to allow the main source to resolve first

  // only disable background mode if the audience camera is a QuadCam
  if (connectorDict.ConnectorId[1] == QUAD_CAM_ID) resumeSpeakerTrack();

  //if (webrtc_mode && !isOSEleven) xapi.Command.Video.Input.MainVideo.Unmute();
  if (webrtc_mode && !isOSEleven) setTimeout(function () { xapi.Command.Video.Input.MainVideo.Unmute() }, WEBRTC_VIDEO_UNMUTE_WAIT_TIME);

}

function largestMicValue() {
  // figure out which of the inputs has the highest average level and return the corresponding key
  let currentMaxValue = 0;
  let currentMaxKey = '';
  let theAverage = 0;

  for (var i in config.monitorMics) {
    theAverage = averageArray(micArrays[config.monitorMics[i].toString()]);
    if (theAverage >= currentMaxValue) {
      currentMaxKey = config.monitorMics[i].toString();
      currentMaxValue = theAverage;
    }
  }

  for (var i in config.ethernetMics) {
    theAverage = averageArray(micArrays[config.ethernetMics[i].toString()]);
    if (theAverage >= currentMaxValue) {
      currentMaxKey = config.ethernetMics[i].toString();
      currentMaxValue = theAverage;
    }
  }

  for (var i in config.usbMics) {
    theAverage = averageArray(micArrays[config.usbMics[i].toString()]);
    if (theAverage >= currentMaxValue) {
      currentMaxKey = config.usbMics[i].toString();
      currentMaxValue = theAverage;
    }
  }

  return currentMaxKey;
}

function averageArray(arrayIn) {
  let sum = 0;
  for (var i = 0; i < arrayIn.length; i++) {
    sum = sum + parseInt(arrayIn[i], 10);
  }
  let avg = (sum / arrayIn.length);
  return avg;
}


async function recallSideBySideMode() {
  if (!manual_mode /*&& roomCombined*/) { //TODO: Make sure that allowing overview when in standalone works ok. 
    inSideBySide = true;
    if (webrtc_mode && !isOSEleven) xapi.Command.Video.Input.MainVideo.Mute();
    // only invoke SideBySideMode if not in presenter QA mode and not presentertrack is currently not active
    // because Presenter QA mode has it's own way of composing side by side. 
    if ((presenterTracking && presenterDetected) && SIDE_BY_SIDE_TIME > 0) {
      // If in PRESENTER_QA_MODE mode and we go to silence, we need to restart the composition timer
      // to remove composition (if it was there) only after the configured time has passed.
      if (PRESENTER_QA_MODE && !webrtc_mode) restartCompositionTimer();
      // even if not in PRESENTER_QA_MODE , if presenterTrack is turned on, we do not want to show anyd side by side mode!
    }
    else {

      if (overviewShowDouble) {
        if (!webrtc_mode) { //only compose if not in webrtc mode (not supported). Otherwise, just use preset 30 if applicable
          let sourceDict = { ConnectorId: [0, 0] }; // just initializing
          //connectorDict["ConnectorId"]=OVERVIEW_DOUBLE_SOURCE_IDS;
          //console.log("Trying to use this for connector dict in recallSideBySideMode(): ", sourceDict  )
          //xapi.command('Video Input SetMainVideoSource', connectorDict).catch(handleError);

          config.compositions.forEach(async compose => {
            if (compose.mics.includes(0)) {
              console.log(`SideBySide setting to composition = ${compose.name}`);
              if (compose.preset != 0 && typeof compose.preset == 'number') {
                console.log(`SideBySide setting Video Input to single preset [${compose.preset}] `);
                sourceDict = { PresetId: compose.preset };
                await xapi.Command.Camera.Preset.Activate(sourceDict);
                let presetCamId = await getPresetCamera(compose.preset);
                let presetCamConnector = await xapi.Status.Cameras.Camera[presetCamId].DetectedConnector.get();
                await xapi.Command.Video.Input.SetMainVideoSource({ ConnectorId: [presetCamConnector], Layout: 'Prominent' });
              }
              else {
                let selected_connectors = []

                if (compose.preset != 0 && typeof compose.preset != 'number') { // if not single preset, it is a list of presets we need to evaluate
                  console.log(`SideBySide setting Video Input to multiple preset as seen in [${compose.preset}] `);
                  // when multiple presets, activate them and then proceed to create the sourceDict and apply as if no
                  // presets
                  compose.preset.forEach(async thePresetID => {
                    sourceDict = { PresetId: thePresetID };
                    await xapi.Command.Camera.Preset.Activate(sourceDict);
                  })
                }

                // first need to remove connectors from un-selected secondaries
                // logic below copies over any local connectos (not associated in codec_map) 
                // including those for cameras associated in presets and
                // also those associated but where secondary codec is selected. 
                compose.connectors.forEach(theConnector => {
                  // only use for overview connectors that are not associated to secondary codecs or if secondary codec is selected
                  if ((!(theConnector in connector_to_codec_map)) || (secondariesStatus[connector_to_codec_map[theConnector]].selected && roomCombined)) {
                    selected_connectors.push(theConnector)
                  }
                })
                console.log(`Setting Video Input to connectors [${selected_connectors}] and Layout: ${compose.layout}`);
                sourceDict = { ConnectorId: selected_connectors, Layout: compose.layout }
                await xapi.Command.Video.Input.SetMainVideoSource(sourceDict);
              }
            }
          })



          lastSourceDict = sourceDict;

          if ('ConnectorId' in sourceDict) { // only notify about composition and handle ST if composition configured for silence is not actually another preset!
            const payload = { EditMatrixOutput: { sources: sourceDict['ConnectorId'] } };
            // let USB Mode Macro know we are composing
            setTimeout(function () {
              localCallout.command(payload).post()
            }, 250) //250ms delay to allow the main source to resolve first
            pauseSpeakerTrack();
            if (QUAD_CAM_ID > 0) xapi.command('Camera Preset Activate', { PresetId: 30 }).catch(handleError);

          }

        }
      }
      else { //TODO: This is no longer being executed since we are forcing overviewShowDouble to true always
        let sourceDict = { SourceID: '0' };
        sourceDict["SourceID"] = OVERVIEW_SINGLE_SOURCE_ID.toString();
        console.log("Trying to use this for source dict in recallSideBySideMode(): ", sourceDict)
        xapi.command('Video Input SetMainVideoSource', sourceDict).catch(handleError);
        lastSourceDict = sourceDict;
        pauseSpeakerTrack();
        if (QUAD_CAM_ID > 0) xapi.command('Camera Preset Activate', { PresetId: 30 }).catch(handleError);
      }

      lastActiveHighInput = 0;
      lowWasRecalled = true;
    }
    if (webrtc_mode && !isOSEleven) setTimeout(function () { xapi.Command.Video.Input.MainVideo.Unmute() }, WEBRTC_VIDEO_UNMUTE_WAIT_TIME);
  }
}

async function recallFullPresenter() {
  console.log("Recalling full presenter in PresenterTrack mode....")
  // the Video Input SetMainVideoSource does not work while Speakertrack is active
  // so we need to pause it in case the we were doing full composition to be able to switch
  // to just the presenter camera
  pauseSpeakerTrack();
  if (webrtc_mode && !isOSEleven) xapi.Command.Video.Input.MainVideo.Mute();

  let presenterSource = await xapi.Config.Cameras.PresenterTrack.Connector.get();
  console.log("Obtained presenter source as: ", presenterSource)
  let connectorDict = { ConnectorId: presenterSource };
  xapi.command('Video Input SetMainVideoSource', connectorDict).catch(handleError);
  lastSourceDict = connectorDict;
  if (webrtc_mode && !isOSEleven) setTimeout(function () { xapi.Command.Video.Input.MainVideo.Unmute() }, WEBRTC_VIDEO_UNMUTE_WAIT_TIME);
  //resumeSpeakerTrack(); // we do not want to leave background mode on
}

async function recallQuadCam() {
  console.log("Recalling QuadCam after manually exiting PresenterTrack mode....")
  pauseSpeakerTrack();
  if (webrtc_mode && !isOSEleven) xapi.Command.Video.Input.MainVideo.Mute();
  //let currentSTCameraID = QUAD_CAM_ID; 
  let currentSTCameraID = await xapi.Status.Cameras.SpeakerTrack.ActiveConnector.get();
  console.log('In recallQuadCam Obtained currentSTCameraID as: ', currentSTCameraID)
  let connectorDict = { SourceId: currentSTCameraID }; xapi.command('Video Input SetMainVideoSource', connectorDict).catch(handleError);
  lastSourceDict = connectorDict;
  if (webrtc_mode && !isOSEleven) setTimeout(function () { xapi.Command.Video.Input.MainVideo.Unmute() }, WEBRTC_VIDEO_UNMUTE_WAIT_TIME);
  resumeSpeakerTrack(); // we do not want to leave background mode on


}


/////////////////////////////////////////////////////////////////////////////////////////
// TOUCH 10 UI SETUP
/////////////////////////////////////////////////////////////////////////////////////////


function addCustomAutoQAPanel() {

  let presenterTrackButtons = `
  <Name>PresenterTrack</Name>
  <Widget>
    <WidgetId>widget_pt_settings</WidgetId>
    <Type>GroupButton</Type>
    <Options>size=4</Options>
    <ValueSpace>
      <Value>
        <Key>1</Key>
        <Name>Off</Name>
      </Value>
      <Value>
        <Key>2</Key>
        <Name>On w/o QA</Name>
      </Value>
      <Value>
        <Key>3</Key>
        <Name>On with QA</Name>
      </Value>
    </ValueSpace>
  </Widget>
  `;
  let presenterTrackButtonsDisabled = `
  <Name>PresenterTrack</Name>
  <Widget>
    <WidgetId>widget_pt_disabled</WidgetId>
    <Name>Not configured</Name>
    <Type>Text</Type>
    <Options>size=3;fontSize=normal;align=center</Options>
  </Widget>`;

  // Here we do the conditional assignment of the row
  let presenterTrackRowValue = (presenterTrackConfigured) ? presenterTrackButtons : presenterTrackButtonsDisabled;

  // add custom control panel for turning on/off automatic mode
  if (ALLOW_PRESENTER_QA_MODE) {
    xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: 'panel_auto_qa' },
      `<Extensions>
      <Version>1.9</Version>
      <Panel>
        <Origin>local</Origin>
        <Location>HomeScreenAndCallControls</Location>
        <Icon>Camera</Icon>
        <Color>#07C1E4</Color>
        <Name>Auto QA</Name>
        <ActivityType>Custom</ActivityType>
        <Page>
          <Name>Automatic QA</Name>
          <Row>
          ${presenterTrackRowValue}
          </Row>
          <PageId>panel_auto_qa</PageId>
          <Options/>
        </Page>
      </Panel>
    </Extensions>
      `);
  } else xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId: 'panel_auto_qa' });

  if (presenterTrackConfigured && ALLOW_PRESENTER_QA_MODE) {
    xapi.command('UserInterface Extensions Widget SetValue', { WidgetId: 'widget_pt_settings', Value: '1' }).catch(handleMissingWigetError);
  }

}

/////////////////////////////////////////////////////////////////////////////////////////
// ERROR HANDLING
/////////////////////////////////////////////////////////////////////////////////////////

function handleError(error) {
  console.log(error);
}

function handleMissingWigetError(error) {
  console.log('Trying to set widget that is not being shown...');
}


async function updateUSBModeConfig() {
  var object = { AlterUSBConfig: { config: 'matrix_Camera_Mode', value: true } }
  await localCallout.command(object).post()
}

/////////////////////////////////////////////////////////////////////////////////////////
// INTER-MACRO MESSAGE HANDLING
/////////////////////////////////////////////////////////////////////////////////////////
GMM.Event.Receiver.on(async event => {
  const usb_mode_reg = /USB_Mode_Version_[0-9]*.*/gm
  if ('RawMessage' in event) {
    // here we are receiving a RawMessage as marked by GMM, so it could be from an external controller
    //first check to ese if it is a custom MIC_ACTIVE Event
    let theEventValue = event.RawMessage;
    let activeMic = '';
    if (theEventValue.slice(0, 11) == 'MIC_ACTIVE_') {
      console.warn("Received unformatted MIC_ACTIVE_XX message: ", event.RawMessage)
      activeMic = theEventValue.substring(11);
      processExternalMicHandler(activeMic);
    } else console.warn(`Did not process received raw message: ${event.RawMessage}`)

  }
  else
    if (event.Source.Id == 'localhost') {
      if (usb_mode_reg.test(event.App)) {// we are evaluating a local event, first check to see if from the USB Mode macro
        if (event.Type == 'Error') {
          console.error(event)
        } else {
          switch (event.Value) {
            case 'Initialized':
              console.warn(`USB mode initialized...`)
              updateUSBModeConfig();
              break;
            case 'EnteringWebexMode': case 'Entering_Default_Mode': case 'EnteringDefaultMode':
              console.warn(`You are entering Webex Mode`)
              //Run code here when Default Mode starts to configure
              break;
            case 'WebexModeStarted': case 'DefaultModeStarted':
              console.warn(`System is in Default Mode`)
              stopAutomation();
              usb_mode = false;
              // always tell the other codec when your are in or out of a call
              await sendIntercodecMessage('CALL_DISCONNECTED');
              if (false) {
                // only need to keep track of codecs being in call with these
                // booleans in primary codec which is the one that initiates join/split
                primaryInCall = false;
                evalCustomPanels();
                handleExternalController('PRIMARY_CALLDISCONNECT');
              } else {
                handleExternalController('SECONDARY_CALLDISCONNECT');

              }
              break;
            case 'enteringUSBMode':
              console.warn(`You are entering USB Mode`)
              //Run code here when USB Mode starts to configure
              break;
            case 'USBModeStarted':
              console.warn(`System is in Default Mode`)
              startAutomation();
              if (SIDE_BY_SIDE_TIME == 0) recallSideBySideMode();
              usb_mode = true;
              // always tell the other codec when your are in or out of a call
              await sendIntercodecMessage('CALL_CONNECTED');

              handleExternalController('SECONDARY_CALLCONNECT');

              break;
            default:
              break;
          }
        }
      }
      else {
        console.debug({
          Message: `Received Message from ${event.App} and was not processed`
        })
      }
    }
    else { // This section is for handling messages sent from primary to secondary codec and vice versa
      // and for messages from Aux to either Primary or Secondary in same room

      const sourceIP = event.Source?.IPv4 ?? event.Source?.IPv6;
      const sourceLan = event.Source?.FQDN ?? sourceIP;
      const theSourceIdentifier = (PRIMARY_BOT_TOKEN == '') ? sourceLan : event.Source?.DeviceId;
      switch (event.App) { //Based on the App (Macro Name), I'll run some code

        case 'divisible_room_primary':
          console.warn("Received from other codec: ", event.Value)
          if (event.Type == 'Error') {
            console.error(event)
          } else {
            switch (event.Value) {

              case 'VTC-1_status':
                handleMacroStatusResponse();
                break;

              case 'VTC_KA_req':
                secSendKeepAliveResponse();
                break;

              case 'side_by_side':
                if (roomCombined && (true)) {
                  console.log('Handling side by side on secondary');
                  deactivateSpeakerTrack();
                  if (QUAD_CAM_ID > 0) xapi.command('Camera Preset Activate', { PresetId: 30 }).catch(handleError);
                }
                break;
              case 'automatic_mode':
                if (roomCombined && (true)) {
                  // handle request to keep speakertrack on from primary to secondary
                  console.log('Turning back on SpeakerTrack on secondary');
                  activateSpeakerTrack();
                }
                break;
              case 'CALL_CONNECTED':
                if (roomCombined && (true)) {
                  // if we are the secondary codec, this event came from primary

                  if (SECONDARY_MULTI_CAM) {
                    // If primary is in call, we now need to start automation since we need to be able to switch amongst local cameras and Aux codecs on the secondary 
                    // as well when combined. This will turn out vumeters for the mute LEDs as well
                    startAutomation();
                  }
                  else {
                    // If primary is in a call, we need to turn on vuMeters just to make sure the mute LEDs show
                    // start VuMeter monitoring
                    console.log("Turning on VuMeter monitoring...")
                    for (var i in config.monitorMics) {
                      xapi.command('Audio VuMeter Start', {
                        ConnectorId: config.monitorMics[i],
                        ConnectorType: 'Microphone',
                        IntervalMs: 500,
                        Source: 'AfterAEC'
                      });
                    }
                  }

                }


                break;
              case 'CALL_DISCONNECTED':
                if (roomCombined && (true)) {

                  if (SECONDARY_MULTI_CAM) {
                    // Now that we can switch among cameras and aux inputs on secondaries, 
                    // we need to turn that off when the primary disconnects a call. 
                    stopAutomation();
                  }
                  else {
                    // Turn vuMeters back off
                    console.log("Stopping all VuMeters...");
                    xapi.Command.Audio.VuMeter.StopAll({});
                  }

                }

                break;


              case 'COMBINE':
                if (true && secondarySelected) {
                  setCombinedMode(true); // Stores status to permanent storage
                  displayWarning();
                  console.log('Secondary received command to combine');
                  secondaryCombinedMode();
                }
                break;
              case 'DIVIDE':
                if (true && secondarySelected) {
                  setCombinedMode(false); // Stores status to permanent storage
                  removeWarning();
                  console.log('Secondary received command to divide');
                  secondaryStandaloneMode();
                }
                break;
              case 'SEC_SELECTED':
                secondarySelected = true;
                await GMM.write.global('JoinSplit_secondarySelected', secondarySelected).then(() => {
                  console.log({ Message: 'ChangeState', Action: 'Secondary selected status state stored.' })
                })
                await sendIntercodecMessage('SEC_SELECTED_ACK')
                break;
              case 'SEC_REMOVED':
                secondarySelected = false;
                await GMM.write.global('JoinSplit_secondarySelected', secondarySelected).then(() => {
                  console.log({ Message: 'ChangeState', Action: 'Secondary selected status state stored.' })
                })
                await sendIntercodecMessage('SEC_REMOVED_ACK')
                break;

              case 'MUTE':
                if (roomCombined) xapi.command('Audio Microphones Mute');
                break;
              case 'UNMUTE':
                if (roomCombined) xapi.command('Audio Microphones Unmute');
                break;
              case 'STANDBY_ON':
                if (roomCombined) xapi.command('Standby Activate');
                break;
              case 'STANDBY_OFF':
                if (roomCombined) xapi.command('Standby Deactivate');
                break;
              case 'STANDBY_HALFWAKE':
                if (roomCombined) xapi.command('Standby Halfwake');
                break;

              default:
                break;
            }
          }
          break;
        case 'Crestron':
          console.warn("Received from app Crestron: ", event.Value)
          if (event.Type == 'Error') {
            console.error(event)
          } else {
            //first check to ese if it is a custom MIC_ACTIVE Event
            let theEventValue = event.Value;
            let activeMic = '';
            if (theEventValue.slice(0, 11) == 'MIC_ACTIVE_') {
              activeMic = theEventValue.substring(11);
              processExternalMicHandler(activeMic);
            }
            else {
              console.debug({
                Message: `Received Message from ${event.App} was not processed`
              })
            }
          }
          break;
        default:
          console.warn(`Received Message ${event.Value} from macro ${event.App} on remote codec but was not processed... rename macro to divisible_room_primary if intended to work with this one.`)
          break;
      }

    }

})


/////////////////////////////////////////////////////////////////////////////////////////
// INTER-CODEC COMMUNICATION
/////////////////////////////////////////////////////////////////////////////////////////

async function sendIntercodecMessage(message) {
  if (PRIMARY_BOT_TOKEN != '') {
    await primaryCodec.status(message).passDeviceId().queue().catch(e => {
      console.log('Error sending message');
    });
    return
  }

  if (FQDN_MODE) {
    await primaryCodec.status(message).passIP().passFQDN().queue().catch(e => {
      console.log('Error sending message');
    });
    return
  }

  await primaryCodec.status(message).passIP().queue().catch(e => {
    console.log('Error sending message');
  });



}




/////////////////////////////////////////////////////////////////////////////////////////
// OTHER FUNCTIONAL HANDLERS
/////////////////////////////////////////////////////////////////////////////////////////


function handleExternalController(macroEvent) {
  console.log(`Issuing commands for external controller when macro initiates or detects: ${macroEvent}`)
  localCallout.command(macroEvent).post()
}

xapi.Event.PresentationStarted.on(value => {
  console.log(value)

  handleExternalController('SECONDARY_PRESENTATION_STARTED');

});

xapi.Event.PresentationStopped.on(value => {
  console.log(value);

  handleExternalController('SECONDARY_PRESENTATION_STOPPED');
});

xapi.Event.PresentationPreviewStopped.on(value => {
  console.log(value);

  handleExternalController('SECONDARY_PREVIEW_STOPPED');
});

function handleMicMuteOn() {
  console.log('handleMicMuteOn');
  lastActiveHighInput = 0;
  lowWasRecalled = true;
  recallSideBySideMode();
}

function handleMicMuteOff() {
  console.log('handleMicMuteOff');
  // need to turn back on SpeakerTrack that might have been turned off when going on mute
  //activateSpeakerTrack();
}




async function handleMacroStatusResponse() {
  console.log('handleMacroStatusResponse');
  await sendIntercodecMessage('VTC-1_OK');
}



// Issue matrix command to keep sending the selected main video input to primary 
// when codec is a secondary and is in combined mode
xapi.Status.Video.Input.MainVideoSource.on(currentMainVideoSource => {
  if (true && roomCombined) {
    console.log(`New main video source in secondary while combined: ${currentMainVideoSource}, matrixing out to video tieline to primary`);
    xapi.command('Video Matrix Assign', { Output: SECONDARY_VIDEO_TIELINE_OUTPUT_TO_PRI_SEC_ID, SourceID: currentMainVideoSource }).catch((error) => { console.error(error); });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
// VARIOUS TIMER HANDLER FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////

function startSideBySideTimer() {
  if (sideBySideTimer == null && SIDE_BY_SIDE_TIME > 0) {
    allowSideBySide = false;
    sideBySideTimer = setTimeout(onSideBySideTimerExpired, SIDE_BY_SIDE_TIME);
  }
}

function stopSideBySideTimer() {
  if (sideBySideTimer != null) {
    clearTimeout(sideBySideTimer);
    sideBySideTimer = null;
  }
}

function restartSideBySideTimer() {
  stopSideBySideTimer();
  startSideBySideTimer();
}

function onSideBySideTimerExpired() {
  console.log('onSideBySideTimerExpired');
  allowSideBySide = true;
  recallSideBySideMode();
}



function startInitialCallTimer() {
  if (InitialCallTimer == null) {
    allowCameraSwitching = false;
    InitialCallTimer = setTimeout(onInitialCallTimerExpired, INITIAL_CALL_TIME);
  }
}

function onInitialCallTimerExpired() {
  console.log('onInitialCallTimerExpired');
  InitialCallTimer = null;
  if (!manual_mode) {
    allowCameraSwitching = true;
    if (!presenterTracking) activateSpeakerTrack();
  }
}

function stopInitialCallTimer() {
  if (InitialCallTimer != null) {
    clearTimeout(InitialCallTimer);
    InitialCallTimer = null;
  }
}

function startCompositionTimer() {
  if (qaCompositionTimer == null) {
    presenterQAKeepComposition = true;
    qaCompositionTimer = setTimeout(onCompositionTimerExpired, PRESENTER_QA_KEEP_COMPOSITION_TIME)
  }
}

function stopCompositionTimer() {
  if (qaCompositionTimer != null) {
    clearTimeout(qaCompositionTimer);
    qaCompositionTimer = null;
  }
}

function restartCompositionTimer() {
  stopCompositionTimer();
  startCompositionTimer();
}

function onCompositionTimerExpired() {
  presenterQAKeepComposition = false;
  if (PRESENTER_QA_MODE && !webrtc_mode && (presenterTracking && presenterDetected)) {
    if (!PRESENTER_QA_AUDIENCE_MIC_IDS.includes(lastActiveHighInput)) {
      // restore single presentertrackview because the person still speaking
      // is not an audience member and the timer has expired (could also be due to silence)
      recallFullPresenter();
    }
  }
}

function startNewSpeakerTimer() {
  if (newSpeakerTimer == null) {
    allowNewSpeaker = false;
    newSpeakerTimer = setTimeout(onNewSpeakerTimerExpired, NEW_SPEAKER_TIME);
  }
}

function stopNewSpeakerTimer() {
  if (newSpeakerTimer != null) {
    clearTimeout(newSpeakerTimer);
    newSpeakerTimer = null;
  }
}

function restartNewSpeakerTimer() {
  stopNewSpeakerTimer();
  startNewSpeakerTimer();
}

function onNewSpeakerTimerExpired() {
  allowNewSpeaker = true;
}

function activateSpeakerTrack() {
  console.log(`activating speakertrack....`)
  macroTurnedOnST = true;
  xapi.Command.Cameras.SpeakerTrack.Activate().catch(handleError);

}

function deactivateSpeakerTrack() {
  console.log(`deactivating speakertrack....`)
  macroTurnedOffST = true;
  xapi.Command.Cameras.SpeakerTrack.Deactivate().catch(handleError);
}

function resumeSpeakerTrack() {
  console.log(`resuming speakertrack....`)
  xapi.Command.Cameras.SpeakerTrack.BackgroundMode.Deactivate().catch(handleError);
}

function pauseSpeakerTrack() {
  console.log(`pausing speakertrack....`)
  xapi.Command.Cameras.SpeakerTrack.BackgroundMode.Activate().catch(handleError);
}


// if the Speakertrack Camera becomes available after FW upgrade, we must re-init so
// we register that action as an event handler
xapi.Status.Cameras.SpeakerTrack.Availability
  .on((value) => {
    console.log("Event received for SpeakerTrack Availability: ", value)
    if (value == "Available") {
      init();
    }
  });

// evalSpeakerTrack handles the turning on/off of automation manually based on selection
// of SpeakerTrack by user
function evalSpeakerTrack(value) {
  console.log('Received speakerTrack event: ', value)
  if (value == 'Active') {
    //if (macroTurnedOnST) {macroTurnedOnST=false;}
    //else {startAutomation();}
    if (manual_mode) {
      startAutomation();
      if (SIDE_BY_SIDE_TIME == 0) recallSideBySideMode(); // need to invoke overview if set to always show
    };

  }
  else {
    //if (macroTurnedOffST) {macroTurnedOffST=false;}
    //else {stopAutomation();}
    if (!manual_mode && !presenterTracking /*&& !inSideBySide*/) stopAutomation();
  }

}

function evalPresenterTrack(value) {
  let currentVal = '1';
  if (presenterTrackConfigured) {
    if (value === 'Follow' || value === 'Persistent') {
      if (PRESENTER_QA_MODE) {
        currentVal = '3';
      }
      else {
        currentVal = '2';
      }
    }
    xapi.command('UserInterface Extensions Widget SetValue', { WidgetId: 'widget_pt_settings', Value: currentVal }).catch(handleMissingWigetError);
  }
}



/////////////////////////////////////////////////////////////////////////////////////////
// INITIALIZATION
/////////////////////////////////////////////////////////////////////////////////////////


async function init_switching() {

  // register callback for processing manual mute setting on codec
  xapi.Status.Audio.Microphones.Mute.on((state) => {
    console.log(`handleMicMuteResponse: ${state}`);
    if (!roomCombined) {
      if (state == 'On') {
        stopSideBySideTimer();
        setTimeout(handleMicMuteOn, 2000);
      }
      else if (state == 'Off') {
        handleMicMuteOff();
      }

    }
  });


  // register handler for Call Successful
  xapi.Event.CallSuccessful.on(async () => {

    console.log("Starting new call timer...");
    //webrtc_mode=false; // just in case we do not get the right event when ending webrtc calls
    await startAutomation();
    recallSideBySideMode();

    // only initialize initial call timer if side by side timer (overview timer) is not zero
    // because, if zero, that means we will always be showing side by side (overview) mode
    if (SIDE_BY_SIDE_TIME > 0) startInitialCallTimer();

    // always tell the other codec when your are in or out of a call
    await sendIntercodecMessage('CALL_CONNECTED');

    handleExternalController('SECONDARY_CALLCONNECT');


  });

  // register handler for Call Disconnect
  xapi.Event.CallDisconnect.on(async () => {
    if (!usb_mode) {
      console.log("Turning off Self View....");
      xapi.Command.Video.Selfview.Set({ Mode: 'off' });
      webrtc_mode = false; // ending webrtc calls is being notified here now in RoomOS11
      stopAutomation();
    }

    // always tell the other codec when your are in or out of a call
    await sendIntercodecMessage('CALL_DISCONNECTED');

    handleExternalController('SECONDARY_CALLDISCONNECT');

  });

  xapi.Event.PresentationPreviewStarted
    .on(async value => {
      await sendIntercodecMessage('PRESENTATION_PREVIEW_STARTED');

      handleExternalController('SECONDARY_PREVIEW_STARTED');

    });

  xapi.Event.PresentationPreviewStopped
    .on(async value => {
      await sendIntercodecMessage('PRESENTATION_PREVIEW_STOPPED');

      handleExternalController('SECONDARY_PREVIEW_STOPPED');

    });

  // register WebRTC Mode
  xapi.Status.UserInterface.WebView.Type
    .on(async (value) => {
      if (value === 'WebRTCMeeting') {
        webrtc_mode = true;

        console.log("Starting automation due to WebRTCMeeting event...");
        startAutomation();
        // only initialize initial call timer if side by side timer (overview timer) is not zero
        // because, if zero, that means we will always be showing side by side (overview) mode
        if (SIDE_BY_SIDE_TIME > 0) startInitialCallTimer();

        // always tell the other codec when your are in or out of a call
        await sendIntercodecMessage('CALL_CONNECTED');

        handleExternalController('SECONDARY_CALLCONNECT');


      } else {
        webrtc_mode = false;
        if (!usb_mode) {
          console.log("Stopping automation due to a non-WebRTCMeeting  event...");
          xapi.Command.Video.Selfview.Set({ Mode: 'off' });
          stopAutomation();
        }
        // always tell the other codec when your are in or out of a call
        await sendIntercodecMessage('CALL_DISCONNECTED');

        handleExternalController('SECONDARY_CALLDISCONNECT');

      }
    });

  // register to receive MainVideoSource change events in support of WebRTC mode to
  // implement workaround
  xapi.Status.Video.Input.MainVideoSource
    .on(async (value) => {
      //console.log(value);
      if (webrtc_mode && !isOSEleven) {
        console.log('Video switched... unmuting from handler..');
        await xapi.Command.Video.Input.MainVideo.Unmute();
      }
    });

  // register to receive events when someone manually turns on speakertrack
  xapi.Status.Cameras.SpeakerTrack.Status.on(evalSpeakerTrack);

  let enabledGet = await xapi.Config.Cameras.PresenterTrack.Enabled.get()
  presenterTrackConfigured = (enabledGet == 'True') ? true : false;
  addCustomAutoQAPanel();

  // register to receive Presenter Detected events when in PresenterTrack mode.
  // This way we can disable logic for presentertracking if the presenter steps away
  // from stage and re-engage once they come back. 
  xapi.Status.Cameras.PresenterTrack.PresenterDetected.on(async value => {
    console.log('Received PT Presenter Detected as: ', value)
    if (value == 'True') {
      presenterDetected = true;
      if (SIDE_BY_SIDE_TIME > 0) {
        // only switch input to presenter fully if we are not forcing overview all the time,
        // otherwise, just let the codec show the presenter within the composition selected for overview
        let presenterSource = await xapi.Config.Cameras.PresenterTrack.Connector.get();
        let connectorDict = { ConnectorId: presenterSource };
        console.log("In PresenterDetected handler switching to input with SetMainVideoSource with dict: ", connectorDict)
        xapi.command('Video Input SetMainVideoSource', connectorDict).catch(handleError);
        lastSourceDict = connectorDict;
      }

    } else {
      presenterDetected = false;
      presenterQAKeepComposition = false;
      if (SIDE_BY_SIDE_TIME > 0) {
        // no need to force a camera switch unless we are indeed switching since ,
        // there is a SIDE_BY_SIDE_TIME value set more than 0
        lastSourceDict = { SourceID: '0' }; // forcing a camera switch
        lastActiveHighInput = 0;
      }

    }
  });


  // register to keep track of when PresenterTrack is active or not
  xapi.Status.Cameras.PresenterTrack.Status.on(value => {
    console.log('Received PT status as: ', value)
    lastSourceDict = { SourceID: '0' }; // forcing a camera switch
    if (value === 'Follow' || value === 'Persistent') {
      presenterTracking = true;
      if (SIDE_BY_SIDE_TIME > 0) {
        // only stop initial call timer if we are not forcing overview all the time,
        stopInitialCallTimer();
        if (PRESENTER_QA_MODE && !webrtc_mode) {
          //showPTPanelButton();
          //recallFullPresenter();
        }
      }
    }
    else {
      presenterTracking = false;
    }
    // Update custom panel
    evalPresenterTrack(value);
  });

  // first check to see if the room is supposed to be in combined mode as per permanent storage
  if (roomCombined) {
    stopAutomation();
  }


  // Stop any VuMeters that might have been left from a previous macro run with a different config.monitorMics constant
  // to prevent errors due to unhandled vuMeter events.
  xapi.Command.Audio.VuMeter.StopAll({});


  // turn off speakertrack to get started
  deactivateSpeakerTrack();
}


async function init() {
  console.log('init');


  if (!await validate_config()) disableMacro("invalid config")

  // make sure Preset 30 exists, if not create it with just an overview shot of camera ID 1 which should be the QuadCam
  if (QUAD_CAM_ID > 0) checkOverviewPreset();

  await GMM.memoryInit();

  if (!USE_GPIO_INTERCODEC) { // When not using GPIO cable, we have to rely on permanent storage value in secondary as well
    roomCombined = await GMM.read.global('JoinSplit_combinedState').catch(async e => {
      //console.error(e);
      console.log("No initial JoinSplit_combinedState global detected, creating one...")
      await GMM.write.global('JoinSplit_combinedState', false).then(() => {
        console.log({ Message: 'Init', Action: 'Combined state stored.' })
      })
      return false;
    })
  }
  secondarySelected = await GMM.read.global('JoinSplit_secondarySelected').catch(async e => {
    //console.error(e);
    console.log("No initial JoinSplit_secondarySelected global detected, creating one...")
    await GMM.write.global('JoinSplit_secondarySelected', true).then(() => {
      console.log({ Message: 'Init', Action: 'Combined state stored.' })
    })
    return false;
  })



  await init_intercodec();

  // check RoomOS versions
  isOSTen = await check4_Minimum_Version_Required(minOS10Version);
  isOSEleven = await check4_Minimum_Version_Required(minOS11Version);


  // register HDMI Passhtorugh mode handlers if RoomOS 11
  if (isOSEleven) {
    xapi.Status.Video.Output.HDMI.Passthrough.Status.on(async value => {
      console.log(value)
      if (value == 'Active') {
        console.warn(`System is in Passthrough Active Mode`)
        startAutomation();
        if (SIDE_BY_SIDE_TIME == 0) recallSideBySideMode();
        usb_mode = true;
        // always tell the other codec when your are in or out of a call
        await sendIntercodecMessage('CALL_CONNECTED');

        handleExternalController('SECONDARY_CALLCONNECT');

      } else {
        console.warn(`System is in Passthrough Inactive Mode`)
        stopAutomation();
        usb_mode = false;
        // always tell the other codec when your are in or out of a call
        await sendIntercodecMessage('CALL_DISCONNECTED');

        handleExternalController('SECONDARY_CALLDISCONNECT');

      }
    });
  }

  setSecondaryDefaultConfig();
  // start sensing changes in PIN 4 to switch room modes. This can be set by wall sensor
  // or custom touch10 UI on PRIMARY codec
  if (USE_GPIO_INTERCODEC) {
    secondaryInitModeChangeSensing();
    secondaryStandbyControl();
    secondaryMuteControl();
  }
  secondaryListenToStandby();
  checkCombinedStateSecondary();
  if (!USE_GPIO_INTERCODEC) {
    // since we are in secondary codec and in split configuration, we need to 
    // prepare to do basic switching to support PresenterTrack QA mode. 
    // we are only doing it here if no GPIO cable is being used, otherwised it gets
    // done in the Pin4 event handler
    init_switching();
  }


}



function setSecondaryToCombined() {
  displayWarning();
  secondaryCombinedMode();
}

function setSecondaryToSplit() {
  removeWarning();
  secondaryStandaloneMode();
}

function secondaryInitModeChangeSensing() {
  xapi.status.on('GPIO Pin 4', (state) => {
    console.log(`GPIO Pin 4[${state.id}] State went to: ${state.State}`);
    if (secondarySelected) // only check state of PIN 4 if this secondary is selected
    {
      if (state.State === 'Low') {
        console.log('Secondary Switched to Combined Mode [Pin 4]');
        setSecondaryToCombined();
      }
      else if (state.State === 'High') {
        console.log('Secondary Switched to Divided Mode [Pin 4]');
        setSecondaryToSplit();
      }
    }
    else {
      console.log('GPIO PIN 4 state ignored since Secondary room is not selected from Primary')
    }
  });
}



function secondaryListenToStandby() {
  xapi.Status.Standby.State.on((state) => {
    console.log("Standby State: " + state);
    // Need to turn off automation when coming out of standby since that seems to turn back on
    // speakertrack which in turn turns on automation
    if (state === 'Off') {
      stopAutomation();
    }
  });
}


function secondaryStandbyControl() {
  xapi.status.on('GPIO Pin 3', (state) => {
    console.log(`GPIO Pin 3[${state.id}] State went to: ${state.State}`);
    if (state.State === 'Low') {
      if (roomCombined) xapi.command('Standby Activate');
    }
    else if (state.State === 'High') {
      if (roomCombined) {
        xapi.command('Standby Deactivate');
        stopAutomation();
      }
    }
  });
}

function secondaryMuteControl() {
  xapi.status.on('GPIO Pin 2', (state) => {
    console.log(`GPIO Pin 2[${state.id}] State went to: ${state.State}`);
    if (state.State === 'Low') {
      if (roomCombined) xapi.command('Audio Microphones Mute')
    }
    else if (state.State === 'High') {
      if (roomCombined) xapi.command('Audio Microphones Unmute ')
    }
  });
}


/////////////////////////////////////////////////////////////////////////////////////////
// SWITCH BETWEEN COMBINED AND STANDALONE
/////////////////////////////////////////////////////////////////////////////////////////
const areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));


async function secondaryStandaloneMode() {
  //setCombinedMode(false);
  roomCombined = false;

  xapi.Command.Standby.Deactivate(); // take out of standby to avoid problems in later versions of RoomOS 11.x
  await delay(2000); // give some time to get out of standby

  handleExternalController('SECONDARY_SPLIT');
  xapi.config.set('Audio Output Line ' + SECONDARY_AUDIO_TIELINE_OUTPUT_TO_PRI_ID + ' Mode', 'Off')
    .catch((error) => { console.error(error); });

  xapi.Config.Audio.Input.HDMI[SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID].Mode.set('Off')
    .catch((error) => { console.error("5" + error); });;


  // decrease main volume by 5Db since it was increased by the same when combining rooms
  if (SECONDARY_COMBINED_VOLUME_CHANGE_STEPS > 0) xapi.Command.Audio.Volume.Decrease({ Steps: SECONDARY_COMBINED_VOLUME_CHANGE_STEPS });
  if (SECONDARY_COMBINED_VOLUME_CHANGE_STEPS == 0 && SECONDARY_COMBINED_VOLUME_STANDALONE > 0) xapi.Command.Audio.Volume.Set({ Level: SECONDARY_COMBINED_VOLUME_STANDALONE });

  // restore secondary settings we stored away before combining
  JoinSplit_secondary_settings = await GMM.read.global('JoinSplit_secondary_settings').catch(async e => {
    console.log("No JoinSplit_secondary_settings global detected.")
    return JoinSplit_secondary_settings;
  });

  if (JoinSplit_secondary_settings.UltrasoundMax >= 0) {
    xapi.Config.Audio.Ultrasound.MaxVolume.set(JoinSplit_secondary_settings.UltrasoundMax);
  }

  if (JoinSplit_secondary_settings.WakeupOnMotionDetection != '') {
    xapi.config.set('Standby WakeupOnMotionDetection', JoinSplit_secondary_settings.WakeupOnMotionDetection)
      .catch((error) => { console.error(error); });
  }

  if (JoinSplit_secondary_settings.StandbyControl != '') {
    xapi.config.set('Standby Control', JoinSplit_secondary_settings.StandbyControl)
      .catch((error) => { console.error(error); });
  }

  if (JoinSplit_secondary_settings.VideoMonitors != '') {
    xapi.Config.Video.Monitors.set(JoinSplit_secondary_settings.VideoMonitors)
      .catch((error) => { console.error(error); });
    switch (JoinSplit_secondary_settings.VideoMonitors) {
      case 'Dual':
        xapi.Config.Video.Output.Connector[1].MonitorRole.set('First');
        xapi.Config.Video.Output.Connector[2].MonitorRole.set('Second');
        break;
      case 'DualPresentationOnly':
        xapi.Config.Video.Output.Connector[1].MonitorRole.set('First');
        xapi.Config.Video.Output.Connector[2].MonitorRole.set('PresentationOnly');
        break;
      case 'Single':
        xapi.Config.Video.Output.Connector[1].MonitorRole.set('First');
        xapi.Config.Video.Output.Connector[2].MonitorRole.set('First');
        break;
    }
  }

  xapi.command('Conference DoNotDisturb Deactivate')
    .catch((error) => { console.error(error); });

  xapi.command('Video Matrix Reset').catch((error) => { console.error(error); });
  xapi.config.set('UserInterface OSD Mode', 'Auto').catch((error) => { console.error("90" + error); });

  addCustomAutoQAPanel();

}

async function secondaryCombinedMode() {
  //setCombinedMode(true);

  // In case this is coming from being a Primary, reset MainVideoSources and DefaultMainSource
  xapi.config.set('Video DefaultMainSource', '1')
    .catch((error) => { console.error("50" + error); });
  xapi.command('Video Input SetMainVideoSource', { ConnectorID: 1 })
    .catch((error) => { console.error("52" + error); });


  roomCombined = true;
  await xapi.Command.Standby.Deactivate(); // take out of standby to avoid problems in later versions of RoomOS 11.x
  await delay(5000); // give some time to get out of standby

  handleExternalController('SECONDARY_COMBINE');

  if (!isOSEleven)
    xapi.config.set('UserInterface OSD Mode', 'Unobstructed')
      .catch((error) => { console.error("91" + error); });
  xapi.config.set('Audio Output Line ' + SECONDARY_AUDIO_TIELINE_OUTPUT_TO_PRI_ID + ' Mode', 'On').catch((error) => { console.error(error); });

  xapi.Config.Audio.Input.HDMI[SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID].Mode.set('On')
    .catch((error) => { console.error("5" + error); });

  xapi.Command.Video.Selfview.Set({ Mode: 'Off' });

  // increase main volume by 5db, will decrease upon splitting again
  if (SECONDARY_COMBINED_VOLUME_CHANGE_STEPS > 0) xapi.Command.Audio.Volume.Increase({ Steps: SECONDARY_COMBINED_VOLUME_CHANGE_STEPS });
  if (SECONDARY_COMBINED_VOLUME_CHANGE_STEPS == 0 && SECONDARY_COMBINED_VOLUME_COMBINED > 0) xapi.Command.Audio.Volume.Set({ Level: SECONDARY_COMBINED_VOLUME_COMBINED });


  //grab current secondary settings before overwriting for combining  
  let ultraSoundMaxValue = await xapi.Config.Audio.Ultrasound.MaxVolume.get()
  let standbyWakeupMotionValue = await xapi.Config.Standby.WakeupOnMotionDetection.get()
  let standbyControlValue = await xapi.Config.Standby.Control.get()

  // store it them in persistent storage, 
  // this also populates JoinSplit_secondary_settings.VideoMonitors before changing 
  // the value in the codec to 'Triple' 
  await storeSecondarySettings(ultraSoundMaxValue, standbyWakeupMotionValue, standbyControlValue);

  xapi.config.set('Audio Ultrasound MaxVolume', '0')
    .catch((error) => { console.error(error); }); // This is so that nobody can pair
  // with the codec when Combined

  xapi.config.set('Standby WakeupOnMotionDetection', 'Off')
    .catch((error) => { console.error(error); });

  //turn off for combined mode so we only control this from primary
  xapi.config.set('Standby Control', 'Off').catch((error) => { console.error(error); });



  xapi.command('Conference DoNotDisturb Activate')
    .catch((error) => { console.error(error); });

  if (JoinSplit_secondary_settings.VideoMonitors == 'Single' && SECONDARY_VIDEO_TIELINE_OUTPUT_TO_PRI_SEC_ID == 2) {
    xapi.Config.Video.Monitors.set('Dual');
  }
  else {
    xapi.Config.Video.Monitors.set('Triple');

  }

  xapi.command('Video Matrix Reset').catch((error) => { console.error(error); });

  xapi.command('Video Matrix Assign', { Output: SECONDARY_VIDEO_TIELINE_OUTPUT_TO_PRI_SEC_ID, SourceID: 1 }).catch((error) => { console.error(error); });
  xapi.command('Video Matrix Assign', { Output: 1, SourceID: SECONDARY_VIDEO_TIELINE_INPUT_M1_FROM_PRI_ID }).catch((error) => { console.error(error); });
  if (JoinSplit_secondary_settings.VideoMonitors == 'Dual' || JoinSplit_secondary_settings.VideoMonitors == 'DualPresentationOnly') {
    xapi.command('Video Matrix Assign', { Output: 2, SourceID: SECONDARY_VIDEO_TIELINE_INPUT_M2_FROM_PRI_ID }).catch((error) => { console.error(error); });
  }

  // switcher actions when secondary is combined
  stopAutomation();
  addCustomAutoQAPanel();

}


/////////////////////////////////////////////////////////////////////////////////////////
// OTHER FUNCTIONAL HANDLERS
/////////////////////////////////////////////////////////////////////////////////////////

//Run DoNoDisturb Every 24 hours at 1am local time
GMM.Event.Schedule.on('01:00', event => {
  console.log(event);
  console.log('Setting DND on daily schedule...')
  if (roomCombined) {
    xapi.Command.Conference.DoNotDisturb.Activate({ Timeout: 1440 });
  }
})

xapi.Status.Cameras.SpeakerTrack.ActiveConnector.on(value => {
  console.log('New Camera connector: ', value);
  ST_ACTIVE_CONNECTOR = parseInt(value);
  if (roomCombined) {
    // need to send to primary codec the video input from the correct ST camera if it is
    // an SP60. If a QuadCam, it will always be 1 and this event wont be firing other than when turning
    // speakertracking on/off which for the secondary codec in combined mode should be only once when combining
    let sourceIDtoMatrix = (ST_ACTIVE_CONNECTOR == 0) ? 1 : ST_ACTIVE_CONNECTOR;
    //TODO fix the problem where matrix assign below when they have SP60 camera array is only seen temporarily and goes back 
    // it appears that as soon as I issue the Matrix command, it turns off speakertrack. I tried pausing it before issuing matrix
    // but it does not work... need something similar to backtround mode, a safe way to switch in matrix command
    // If not possile to SpeakerTrack with SP60 on Secondary room , then need to find a way to detect that on secondary and simply
    // not try to speakertrack when in combined mode and keep preset 30 always so it is predictable which camera to send across the tieline
    // Since in combined mode the secondary should be sending camera input through monitor connector 2 or 3 out to 
    // the primary, the SetMainVideoSource command below instead of the Video Matrix Assign command should work... need to test. 
    /*
    let sourceDict = { SourceID: '0' }
    sourceDict["SourceID"] = sourceIDtoMatrix.toString();
    xapi.Command.Video.Input.SetMainVideoSource(sourceDict);
    */
    xapi.command('Video Matrix Assign', { Output: SECONDARY_VIDEO_TIELINE_OUTPUT_TO_PRI_SEC_ID, SourceID: sourceIDtoMatrix }).catch((error) => { console.error(error); });
  }
});


xapi.event.on('UserInterface Message Prompt Response', (event) => {
  switch (event.FeedbackId) {
    case 'displayPrompt':
      if (roomCombined === true) {
        console.log("Redisplaying the prompt");
        xapi.command("UserInterface Message Prompt Display", {
          Title: 'Combined Mode',
          Text: 'This codec is in combined mode',
          FeedbackId: 'displayPrompt',
          'Option.1': 'Please use main Touch Panel',
        }).catch((error) => { console.error(error); });
      }
      break;
  }
});

xapi.event.on('UserInterface Message Prompt Cleared', (event) => {
  switch (event.FeedbackId) {
    case 'displayPrompt':
      if (roomCombined === true) {
        console.log("Redisplaying the prompt");
        xapi.command("UserInterface Message Prompt Display", {
          Title: 'Combined Mode',
          Text: 'This codec is in combined mode',
          FeedbackId: 'displayPrompt',
          'Option.1': 'Please use main Touch Panel',
        }).catch((error) => { console.error(error); });
      }
      break;
  }
});

function displayWarning() {
  xapi.command('UserInterface Message Prompt Display', {
    Title: 'Combined Mode',
    Text: 'This codec is in combined mode',
    FeedbackId: 'displayPrompt',
    'Option.1': 'Please use main Touch Panel'
  }).catch((error) => { console.error(error); });
  xapi.config.set('UserInterface Features HideAll', 'True')
    .catch((error) => { console.error(error); });
}

function removeWarning() {
  xapi.command("UserInterface Message Prompt Clear");
  xapi.config.set('UserInterface Features HideAll', 'False')
    .catch((error) => { console.error(error); });
}

async function monitorOnAutoError(message) {
  let macro = module.name.split('./')[1]
  await xapi.Command.UserInterface.Message.Alert.Display({
    Title: message.Error,
    Text: message.Message,
    Duration: 30
  })
  console.error(message)
  await xapi.Command.Macros.Macro.Deactivate({ Name: macro })
  await xapi.Command.Macros.Runtime.Restart();
}


GMM.Event.Queue.on(report => {
  //The queue will continuously log a report to the console, even when it's empty.
  //To avoid additional messages, we can filter the Queues Remaining Requests and avoid it if it's equal to Empty
  if (report.QueueStatus.RemainingRequests != 'Empty') {
    report.Response.Headers = [] // Clearing Header response for the simplicity of the demo, you may need this info
    //console.log(report)
  }
});



/////////////////////////////////////////////////////////////////////////////////////////
// INVOCATION OF INIT() TO START THE MACRO
/////////////////////////////////////////////////////////////////////////////////////////


async function delayedStartup(time = 120) {
  while (true) {
    const upTime = await xapi.Status.SystemUnit.Uptime.get()

    if (upTime > time) {
      await init();
      break;
    } else {
      delay(5000);
    }
  }
}

delayedStartup();
