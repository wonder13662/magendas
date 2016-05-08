var facebookSDK = {
  hasInitialized:false
  , isLogIn:false
  , accessToken:null
  // @ Private
  , loadSDK:function() {

    if(this.hasInitialized) {
      return;
    }

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk')
    );
  }  
  // @ Public
  , FBAppId:""
  , FBSDKVer:""
  , init:function(appId, version, callback, callbackScope, paramObj) {

    if(this.hasInitialized) {
      console.log("!Error! / init / this.hasInitialized");
      return;
    }
    if(_v.is_not_valid_str(appId)) {
      console.log("!Error! / init / _v.is_not_valid_str(appId)");
      return;
    }
    if(_v.is_not_valid_str(version)) {
      console.log("!Error! / init / _v.is_not_valid_str(version)");
      return;
    }
    if(callback == null) {
      console.log("!Error! / logIn / callback == null");
      return;
    }
    if(callbackScope == null) {
      console.log("!Error! / logIn / callbackScope == null");
      return;
    }

    this.FBAppId = appId;
    this.FBSDKVer = version;

    var _self = this;
    window.fbAsyncInit = function() {

      FB.init({
        appId      : appId,
        xfbml      : true,
        version    : version
      });

      _self.hasInitialized = true;

      // it calls when SDK is ready.
      callback.apply(callbackScope, [paramObj]);
    };

    // Load the SDK asynchronously
    this.loadSDK();
    
  }
  // @ Private
  , logIn:function(callback, callbackScope, paramObj) { // facebookSDK.logIn()

    if(callback == null) {
      console.log("!Error! / logIn / callback == null");
      return;
    }
    if(callbackScope == null) {
      console.log("!Error! / logIn / callbackScope == null");
      return;
    }
    var nextParamObj = {
      callback:callback
      ,callbackScope:callbackScope
      ,paramObj:paramObj
    }

    if(!this.isLogIn) {

      var callback = function(paramObj) {

        console.log("logIn / paramObj ::: ",paramObj);

        //isLogIn
        if(paramObj != null && paramObj.isLogIn) {

          paramObj.callback.apply(paramObj.callbackScope,[paramObj.paramObj]);
          
        } else {

          FB.login(function(response){

            // Handle the response object, like in statusChangeCallback() in our demo code.
            console.log("logIn / response :: ",response);

            // paramObj
            var callback = paramObj.callback;
            var callbackScope = paramObj.callbackScope;
            var nextParamObj = paramObj.paramObj;

            nextParamObj.response = response;
            callback.apply(callbackScope, [nextParamObj]);

          }, {scope: 'email,publish_actions,publish_pages,manage_pages,read_insights'});          

        }

      } // end callback
      var callbackScope = this;

      this.checkLoginState(callback, callbackScope, nextParamObj);

    } else {

      FB.login(function(response){

        // Handle the response object, like in statusChangeCallback() in our demo code.
        console.log("logIn / response :: ",response);

        paramObj.response = response;
        callback.apply(callbackScope, [paramObj]);

      }, {scope: 'email,publish_actions,publish_pages,manage_pages,read_insights'});

    }

  }
  , logOut:function() { // facebookSDK.logOut()

    if(!this.hasInitialized) {
      console.log("!Error! / logIn / !this.hasInitialized");
      return;
    }
    if(!this.isLogIn) {
      console.log("!Error! / logIn / !this.isLogIn");
      return; 
    }

    FB.logout(function(response){
      // Handle the response object, like in statusChangeCallback() in our demo code.
      console.log("logIn / response :: ",response);
    });

  }

  // @ Private
  , checkLoginState:function(callback, callbackScope, paramObj) {

    if(!this.hasInitialized) {
      console.log("!Error! / initLogIn / !this.hasInitialized");
      return;
    }
    if(callback == null) {
      console.log("!Error! / initLogIn / callback == null");
      return;
    }
    if(callbackScope == null) {
      console.log("!Error! / initLogIn / callbackScope == null");
      return;
    }
    if(paramObj == null) {
      paramObj = {};
    }

    // This is called with the results from from FB.getLoginStatus().
    var _self = this;
    FB.getLoginStatus(function(response) {

      _self.isLogIn = true;
      var isLogIn = false;
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        isLogIn = true;
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        isLogIn = false;
      } else {
        // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
        isLogIn = false;
      }
      paramObj.isLogIn = isLogIn;

      //callback, callbackScope        
      callback.apply(callbackScope,[paramObj]);

    });

  }
  // @ Private
  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  , testAPI:function() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        console.log("response ::: ",response);

        // document.getElementById('status').innerHTML =
        //   'Thanks for logging in, ' + response.name + '!';
      });
  }
  // @ Public
  , getMe:function() {

    if(!this.isLogIn) {
      console.log("!Error! / getMe / !this.isLogIn");
      return; 
    }

    FB.api(
      '/me',
      'GET',
      {"fields":"id,name,picture"},
      function(response) {
          // Insert your code here
          console.log("HERE / 0011 / response :: ",response);
      }
    );    

  }
  // @ Public
  , getPermission:function() {

    if(!this.isLogIn) {
      console.log("!Error! / getMe / !this.isLogIn");
      return; 
    }

    FB.api('/me/permissions', function(response) {
        console.log("HERE / 001 / response :: ",response);
    });
    
  }
  // @ Public
  , getPage:function(pageId) {

    if(!this.isLogIn) {
      console.log("!Error! / getMe / !this.isLogIn");
      return; 
    }

    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / initLogIn / _v.is_not_valid_str(pageId)");
      return;
    }
    
    FB.api(
        "/{page-id}".replace(/\{page\-id\}/gi, pageId),
        function (response) {

          console.log("getPage / response ::: ",response);

          if (response && !response.error) {
            /* handle the result */

          } else {
            /* handle the error */

          }
        }
    ); // End FB.api

  }



  // @ Public
  , getPost:function(postId) {

    if(!this.isLogIn) {
      console.log("!Error! / getMe / !this.isLogIn");
      return; 
    }

    if(_v.is_not_valid_str(postId)) {
      console.log("!Error! / getMe / _v.is_not_valid_str(postId)");
      return;
    }

    FB.api(
        "/{post-id}".replace(/\{post\-id\}/gi, postId),
        function (response) {

          console.log("getPost / response ::: ",response);
          
          if (response && !response.error) {
            /* handle the result */
          }
        }
    );

  }

  // @ Public
  , writePagePostVisitor:function(pageId, message) {

    if(!this.isLogIn) {
      console.log("!Error! / writePagePostVisitor / !this.isLogIn");
      return; 
    }

    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / writePagePostVisitor / _v.is_not_valid_str(pageId)");
      return;
    }

    if(_v.is_not_valid_str(message)) {
      console.log("!Error! / writePagePostVisitor / _v.is_not_valid_str(message)");
      return;
    }

    FB.api(
        "/{page-id}/feed".replace(/\{page\-id\}/gi, pageId),
        "POST",
        {
            "message":message
        },        
        function (response) {

          console.log("writePagePostVisitor / response ::: ",response);

          if (response && !response.error) {
            /* handle the result */
          }
        }
    );    
  }

  // @ Public
  , getPagePosts:function(callback, callbackScope, paramObj) {

    if(paramObj == null) {
      console.log("!Error! / getPagePosts / paramObj == null");
      return;
    }
    var pageId = paramObj.pageId;
    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / getPagePosts / _v.is_not_valid_str(pageId)");
      return;
    }

    if(callback == null) {
      console.log("!Error! / getPagePosts / callback == null");
      return;
    }

    if(callbackScope == null) {
      console.log("!Error! / getPagePosts / callbackScope == null");
      return;
    }
    var nextParamObj = {
      callback:callback
      , callbackScope:callbackScope
      , paramObj:paramObj
      , pageId:pageId
    }

    var callback = function(paramObj) {

      console.log("AAA / callback / paramObj ::: ",paramObj);

      if(paramObj == null) {
        console.log("!Error! / getPagePosts / paramObj == null");
        return;
      }
      if(paramObj.accessToken == null) {
        console.log("!Error! / getPagePosts / paramObj.accessToken == null");
        return;
      }
      var accessToken = paramObj.accessToken;

      // write the page post after getting Page Access Token
      FB.api(
          "/{page-id}/promotable_posts".replace(/\{page\-id\}/gi, paramObj.pageId),
          "GET",
          {
              access_token:accessToken
          },
          function (response) {

            if (response && !response.error) {
              /* handle the result */

              var postList = response.data;
              var nextParamObj = paramObj.paramObj;
              nextParamObj.postList = postList;
              paramObj.callback.apply(paramObj.callbackScope, [nextParamObj]);

            } else {
              /* handle the error */

            }
          }
      ); // End FB.api      

    }
    var callbackScope = this;

    if(!this.isLogIn) {

      // if not logged in, log in.
      this.logIn(function(paramObj) {

        console.log("YYY / 001 / paramObj ::: ",paramObj);
        this.getPageAccessTokenAsync(callback, callbackScope, nextParamObj);

      }, this, nextParamObj);

    } else {

      console.log("YYY / 002 / nextParamObj ::: ",nextParamObj);
      this.getPageAccessTokenAsync(callback, callbackScope, nextParamObj);

    }

  }  

  // REMOVE ME
  // @ Public
  /*
  , writePagePostAdmin:function(pageId, message, isPublished) {

    if(!this.isLogIn) {
      console.log("!Error! / writePagePostVisitor / !this.isLogIn");
      return; 
    }

    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / writePagePostVisitor / _v.is_not_valid_str(pageId)");
      return;
    }

    if(_v.is_not_valid_str(message)) {
      console.log("!Error! / writePagePostVisitor / _v.is_not_valid_str(message)");
      return;
    }

    if(isPublished == null) {
      isPublished = false;
    }

    var paramObj = {
      pageId:pageId,
      message:message + " / " + isPublished,
      isPublished:isPublished
    }

    var callback = function(accessToken, paramObj) {

      console.log("callback / writePagePostAdmin / accessToken ::: ",accessToken);
      console.log("callback / writePagePostAdmin / paramObj ::: ",paramObj);

      var paramFBObj = null;
      if(paramObj.isPublished === true) {

        paramFBObj = 
        {
            message:paramObj.message,
            // link:link,
            access_token:accessToken
        }

      } else {

        paramFBObj = 
        {
            message:paramObj.message,
            // link:link,
            access_token:accessToken,
            published:paramObj.isPublished
        }

      }

      // write the page post after getting Page Access Token
      FB.api(
          "/{page-id}/feed".replace(/\{page\-id\}/gi, paramObj.pageId),
          "POST",
          paramFBObj,
          function (response) {

            console.log("callback / writePagePostAdmin / response ::: ",response);

            if (response && !response.error) {
              // handle the result

            } else {
              // handle the error
              // TODO

            }

          }
      );
    }
    var callbackScope = this;

    this.getPageAccessTokenAsync(callback, callbackScope, paramObj);

  }  
  */
  
  // REMOVE ME
  // @ Private
  /*
  , updatePostStatusPublished:function(postId, isPublished) {

    if(_v.is_not_valid_str(postId)) {
      console.log("!Error! / drawFBPostList / _v.is_not_valid_str(pageId)");
      return;
    }
    if(isPublished == null) {
      isPublished = false;
    }

    FB.api(
        "/{post-id}".replace(/\{post\-id\}/gi, postId),
        "POST",
        {
            is_published:isPublished
        },
        function (response) {

          console.log("updatePostStatusPublished / response ::: ",response);

          if (response && !response.error) {

          }
        }
    );

  }
  */

  // REMOVE ME
  // @ Public
  /*
  , drawFBPostList:function(parentJq, pageId) {

    if(parentJq == null) {
      console.log("!Error! / drawFBPostList / parentJq == null");
      return;
    }
    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / drawFBPostList / _v.is_not_valid_str(pageId)");
      return;
    }

    var callback = function(paramObj) {

      var pagePostList = paramObj.postList;

      // draw facebook posts
      var embedPostTag = paramObj.embedPostTag;
      var parentJq = paramObj.parentJq;
      for(var idx = 0; idx < pagePostList.length; idx++) {
        var pagePostObj = pagePostList[idx];
        var pageNpostId = pagePostObj.id;
        var pageNpostIdArr = pageNpostId.split("_");
        if(pageNpostIdArr == null || pageNpostIdArr.length != 2) {
          console.log("!Error! / pageNpostIdArr == null || pageNpostIdArr.length != 2");
          continue;
        }

        var pageId = pageNpostIdArr[0];
        var postId = pageNpostIdArr[1];

        var nextEmbedTag = 
        embedPostTag
        .replace(/\{page\-id\}/gi, pageId)
        .replace(/\{post\-id\}/gi, postId)
        ;

        parentJq.append(nextEmbedTag);
        console.log("nextEmbedTag ::: ",nextEmbedTag);
      }

      //http://stackoverflow.com/questions/34368016/how-to-update-replace-facebook-embedded-posts-in-html
      FB.XFBML.parse();

    }
    var callbackScope = this;
    var paramObj = {
      parentJq:parentJq
      , pageId:pageId
      , embedPostTag:"<div class=\"fb-post\" data-href=\"https://www.facebook.com/{page-id}/posts/{post-id}/\" data-width=\"1000\"></div>"
    }
    this.getPagePosts(callback, callbackScope, paramObj);

  }
  */

  // @ Private
  , pageAccessToken:{
    pageId:-1
    ,accessToken:""
  }
  , getPageAccessTokenAsync:function(callback, callbackScope, paramObj, forceToUpdate) {

    if(paramObj == null) {
      console.log("!Error! / getPageAccessTokenAsync / paramObj == null");
      return;
    }
    var pageId = paramObj.pageId;
    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / getPageAccessTokenAsync / _v.is_not_valid_str(pageId)");
      return;
    }
    if(callback == null) {
      console.log("!Error! / getPageAccessTokenAsync / callback == null");
      return;
    }
    if(callbackScope == null) {
      console.log("!Error! / getPageAccessTokenAsync / callbackScope == null");
      return;
    }
    if(forceToUpdate == null) {
      forceToUpdate = false;
    }
    if(this.pageAccessToken.pageId == -1 || (this.pageAccessToken.pageId != -1 && this.pageAccessToken.pageId != pageId)) {
      this.pageAccessToken.pageId=pageId;
      forceToUpdate = true;
    } else if(!forceToUpdate && this.pageAccessToken.pageId == pageId) {

      paramObj.accessToken = this.pageAccessToken.accessToken;
      callback.apply(callbackScope, [paramObj]);

      return;
    }

    var _self = this;
    var nextCallback = function(paramObj) {

      var callback = paramObj.callback;
      var callbackScope = paramObj.callbackScope;
      var paramObj = paramObj.paramObj;
      var pageId = paramObj.pageId;

      FB.api(
        "/{page-id}".replace(/\{page\-id\}/gi, pageId),
        'GET',
        {
            "fields":"access_token"
        },

        function(response) {

            if(response != null && response.access_token != null) {
              if(forceToUpdate) {
                _self.pageAccessToken.accessToken = response.access_token;
              }
              paramObj.accessToken = response.access_token;
              callback.apply(callbackScope, [paramObj]);

            }

        } // end callback

      ); // end FB api

    }
    var nextCallbackScope = this;
    var nextParamObj = {
      callback:callback,
      callbackScope:callbackScope,
      paramObj:paramObj,
      pageId:pageId
    };
    this.logIn(nextCallback, nextCallbackScope, nextParamObj);

  }

  // wonder.jung

  // @ Public
  , PUBLISHED_CONTENT_TYPE_PUBLISHED:"PUBLISHED"
  , UNPUBLISHED_CONTENT_TYPE_SCHEDULED:"SCHEDULED"
  , UNPUBLISHED_CONTENT_TYPE_DRAFT:"DRAFT"
  , UNPUBLISHED_CONTENT_TYPE_ADS_POST:"ADS_POST"
  , isValidUnpublishedContentType:function(contentType) {
    if(contentType == null) {
      return false;
    }
    if( contentType === this.UNPUBLISHED_CONTENT_TYPE_SCHEDULED || 
        contentType === this.UNPUBLISHED_CONTENT_TYPE_DRAFT || 
        contentType === this.UNPUBLISHED_CONTENT_TYPE_ADS_POST) {

        return true;
    }

    return false;
  }
  // @ Private
  ,fileUpload:function(callback, callbackScope, paramObj) {

      var formUpload = paramObj.formUpload;
      if(formUpload == null) {
        console.log("!Error! / fileUpload / formUpload == null");
        return;
      }
      var url = paramObj.url;
      if(url == null) {
        console.log("!Error! / fileUpload / url == null");
        return;
      }
      var postParam = paramObj.postParam;


      // http://stackoverflow.com/questions/4264599/facebook-new-javascript-sdk-uploading-photos-with-it
      // Create an iframe 
      var iframe = document.createElement("iframe");
      iframe.setAttribute('id', "upload_iframe");
      iframe.setAttribute('name', "upload_iframe");
      iframe.setAttribute('width', "0px");
      iframe.setAttribute('height', "0px");
      iframe.setAttribute('border', "0");
      iframe.setAttribute('style', "width: 0; height: 0; border: none;");

      // Add to document.
      formUpload.parentNode.appendChild(iframe);
      window.frames['upload_iframe'].name = "upload_iframe";

      iframeId = document.getElementById("upload_iframe");

      // Add event to detect when upload has finished
      var eventHandler = function () {

          console.log("iframeId :: ",iframeId);

          if (iframeId.detachEvent){

              iframeId.detachEvent("onload", eventHandler);

          } else {

              iframeId.removeEventListener("load", eventHandler, false);

          }

          setTimeout(function() {
              try {
                $('#upload_iframe').remove();
              } catch (e) {
                console.log("e :: ",e);

              }
          }, 100);

          // Uploading accomplised.
          callback.apply(callbackScope, [paramObj]);
      }

      if (iframeId.addEventListener)
          iframeId.addEventListener('load', eventHandler, true);
      if (iframeId.attachEvent)
          iframeId.attachEvent('onload', eventHandler);

      // Set properties of form...
      formUpload.setAttribute('target', 'upload_iframe');
      formUpload.setAttribute('action', url);
      formUpload.setAttribute('method', 'post');
      formUpload.setAttribute('enctype', 'multipart/form-data');
      formUpload.setAttribute('encoding', 'multipart/form-data');

      var formUploadJq = $(formUpload);

      if(postParam != null) {

        for(var key in postParam) {
          var value = postParam[key];
          var paramInput = 
          "<input type=\"hidden\" name=\"{name}\" value=\"{value}\"/>"
          .replace(/\{name\}/gi, key)
          .replace(/\{value\}/gi, value)
          ;

          console.log("paramInput ::: ",paramInput);
          formUploadJq.append(paramInput);
        }

      }

      // Submit the form...
      formUpload.submit();

  }
  , uploadVideo:function(callback, callbackScope, paramObj) {

    if(paramObj == null) {
      console.log("!Error! / uploadVideo / paramObj == null");
      return;
    }

    var pageId = paramObj.pageId;
    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / uploadVideo / _v.is_not_valid_str(pageId)");
      return;
    }

    paramObj.url = 
    "https://graph-video.facebook.com/{version}/{page-id}/videos"
    .replace(/\{version\}/gi, this.FBSDKVer)
    .replace(/\{page\-id\}/gi, pageId)
    ;

    this.uploadMediaFile(callback, callbackScope, paramObj);
  }
  , uploadPhoto:function(callback, callbackScope, paramObj) {

    if(paramObj == null) {
      console.log("!Error! / uploadVideo / paramObj == null");
      return;
    }

    var pageId = paramObj.pageId;
    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / uploadVideo / _v.is_not_valid_str(pageId)");
      return;
    }

    paramObj.url = 
    "https://graph.facebook.com/{version}/{page-id}/photos"
    .replace(/\{version\}/gi, this.FBSDKVer)
    .replace(/\{page\-id\}/gi, pageId)
    ;

    this.uploadMediaFile(callback, callbackScope, paramObj);
  }  
  , uploadMediaFile:function(callback, callbackScope, paramObj) {

    if(paramObj == null) {
      console.log("!Error! / uploadVideo / paramObj == null");
      return;
    }
    var formUpload = paramObj.formUpload;
    if(formUpload == null) {
      console.log("!Error! / uploadVideo / formUpload == null");
      return;
    }
    var pageId = paramObj.pageId;
    if(_v.is_not_valid_str(pageId)) {
      console.log("!Error! / uploadVideo / _v.is_not_valid_str(pageId)");
      return;
    }
    var url = paramObj.url;
    if(formUpload == null) {
      console.log("!Error! / uploadVideo / url == null");
      return;
    }

    var published = true;
    if(paramObj.published != null) {
      published = paramObj.published;
    }
    var unpublishedContentType = "";
    if( !published && 
        paramObj.unpublishedContentType != null && 
        this.isValidUnpublishedContentType(paramObj.unpublishedContentType) ) {

      unpublishedContentType = paramObj.unpublishedContentType;
    }


    if(callback == null) {
      console.log("!Error! / uploadVideo / callback == null");
      return;
    }
    if(callbackScope == null) {
      console.log("!Error! / uploadVideo / callbackScope == null");
      return;
    }

    var nextParamObj = {
      formUpload:formUpload,
      pageId:pageId, 
      description:paramObj.description, 
      published:published, 
      unpublishedContentType:unpublishedContentType,
      callback:callback,
      callbackScope:callbackScope,
      url:url
    };

    var _self = this;
    var nextCallback = function(paramObj) {

      console.log("uploadVideo / nextCallback / paramObj ::: ",paramObj);

      var formUpload = paramObj.formUpload;
      var pageId = paramObj.pageId; 
      // var videoTitle = paramObj.videoTitle;
      var published = paramObj.published;
      var unpublishedContentType = paramObj.unpublishedContentType;
      var callback = paramObj.callback;
      var callbackScope = paramObj.callbackScope;
      var accessToken = paramObj.accessToken;
      var description = paramObj.description;

      var postParam = {
        access_token:accessToken,
        published:published,
        unpublished_content_type:unpublishedContentType,
        description:description
      }
      paramObj.postParam = postParam;

      _self.fileUpload(callback, callbackScope, paramObj);
    }
    var nextCallbackScope = this;
    this.getPageAccessTokenAsync(nextCallback, nextCallbackScope, nextParamObj);

  }

}

