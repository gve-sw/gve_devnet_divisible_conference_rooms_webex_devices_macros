4/9/24 First version:

- Derived from gve_devnet_n_way_divisible_conference_rooms_webex_devices macros but limited to 2 or 3 rooms, no support for complex layouts with primary promotion and no support for Aux codecs in each room

2/2/25

- Added support for fully qualified domain names (FQDN) for LAN based inter-codec communications
- Added a toggle to enforce secure HTTPS for LAN based inter-codec communications

5/19/25 Changes (version 1.0.3)

- Changed method of obtaining module name CommonJS to ECMAScript given the deprecation of CommonJS in RoomOS.

6/3/25 Changes (version 1.0.4)

- Re-incorporated code on secondary to handle PresenterTrack with QA mode when divided.

6/6/25 Changes (version 1.0.5)

- Changed syntax for xapi.Config.Audio.Input.USBInterface[1].EchoControl.Mode.get() call which is now case sensitive (worked with lower case c for "config" originally)
