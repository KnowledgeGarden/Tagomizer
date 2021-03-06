/*
 //====================================================================================================================
 // Webble World
 // [IntelligentPad system for the web]
 // Copyright (c) 2010 Micke Nicander Kuwahara, Giannis Georgalis, Yuzuru Tanaka in Meme Media R&D Group of Hokkaido University
 // v3.0 (2013)
 //
 // Lead Meme Media Architect: Yuzuru Tanaka
 // Webble System Lead Architect & Developer: Micke Nicander Kuwahara
 // Server Side Development: Giannis Georgalis
 // Additional Support: Jonas Sjöbergh
 //
 // This file is part of Webble World (c).
 // ******************************************************************************************
 // Webble World is licensed under the Apache License, Version 2.0 (the "License");
 // you may not use this file except in compliance with the License.
 // You may obtain a copy of the License at
 //
 // http://www.apache.org/licenses/LICENSE-2.0
 //
 // Unless required by applicable law or agreed to in writing, software
 // distributed under the License is distributed on an "AS IS" BASIS,
 // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 // See the License for the specific language governing permissions and
 // limitations under the License.
 // ******************************************************************************************
 // The use of the word "Webble" or "webble" for the loadable meme media objects are limited
 // only to objects that actually loads in this original Webble World Platform. Modifications
 // of the meme media object code which leads to breaking of compatibility with the original
 // Webble World platform, may no longer be referred to as a "Webble" or "webble".
 // ******************************************************************************************
 //====================================================================================================================
 */


/*
 ===========================================================================================
 DESCRIPTION:
 This file contains override settings of specific Webble World variables that when set
 configure the application to behave and look a certain way no matter of individual
 settings or system default.
 ==========================================================================================
 */


// WEBBLE WORLD RELATED PROPERTIES [Leave blank if you want the system to work by default]
//--------------------------------------------------------------------------------------------
var wblwrldSystemOverrideSettings = {
    // Appearance Related
    ignore_UserSettings: false,         // on the form true or false -- set to true if you want the js settings to rule instead
    platform_Background: "",            // on the form of color name or hexadecimal string
    platform_ScrollbarVertical: "",     // on the form "auto", "scroll", "hidden" or "visible"
    platform_ScrollbarHorizontal: "",   // on the form "auto", "scroll", "hidden" or "visible"
    systemMenuVisibility: "",           // on the form "true" or "false"
    sysLang: "",                        // on the form of international language code
    popupEnabled: "",                   // on the form "true" or "false" whether the popup messages are enabled or not
    autoBehaviorEnabled: "",            // on the form "true" or "false" whether any auto behavior should be (e.g. default slot connection)

    // Functionality Related
    requestedPlatformPotential: -1,     // Platform Potential Control (-1=Ignore, 0=None (no menu) , 1=Slim (basically only ABOUT), 2=Limited (No Webservice related menu items), 3=Full (All Menu Items), 4=Custom (not implemented))
    pageTitle: "",                      // Title bar text
    aboutInfoText: "",                  // About App Text
    autoLoadedWebblePath: ""            // relative or absolute path for a webble (app or any) that should be loaded automatically
};
//--------------------------------------------------------------------------------------------
