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
	, getPhoto:function(callback, callbackScope, paramObj) {

		if(paramObj == null) {
			console.log("!Error! / getPhoto / paramObj == null");
			return;
		}
		var objectId = paramObj.objectId;
		if(_v.is_not_valid_str(objectId)) {
			console.log("!Error! / getPhoto / _v.is_not_valid_str(objectId)");
			return;
		}

		var nextParamObj = {
			callback:callback
			, callbackScope:callbackScope
			, paramObj:paramObj
			, objectId:objectId
		}

		var callback = function(paramObj) {

			if(paramObj == null) {
				console.log("!Error! / getPhoto / paramObj == null");
				return;
			}
			if(paramObj.paramObj == null) {
				console.log("!Error! / getPhoto / paramObj.paramObj == null");
				return;
			}

			FB.api(
				"/{photo-id}".replace(/\{photo\-id\}/gi, paramObj.objectId),
				{"fields":"id,album,from,height,width,images,link,picture"},
				function (response) {

					paramObj.paramObj.photo = response;

					if (response && !response.error) {

						paramObj.callback.apply(paramObj.callbackScope,[paramObj.paramObj]);

					}

				}
			); // end FB api

		} // end callback
		var callbackScope = this;

		if(!this.isLogIn) {

			// if not logged in, log in.
			this.logIn(function(paramObj) {

				this.getPageAccessTokenAsync(callback, callbackScope, nextParamObj);

			}, this, nextParamObj);

		} else {

			this.getPageAccessTokenAsync(callback, callbackScope, nextParamObj);

		}

	}

	// @ Public
	, getVideo:function(callback, callbackScope, paramObj) {

		if(paramObj == null) {
			console.log("!Error! / getVideo / paramObj == null");
			return;
		}
		var objectId = paramObj.objectId;
		if(_v.is_not_valid_str(objectId)) {
			console.log("!Error! / getVideo / _v.is_not_valid_str(objectId)");
			return;
		}

		var nextParamObj = {
			callback:callback
			, callbackScope:callbackScope
			, paramObj:paramObj
			, objectId:objectId
		}

		var callback = function(paramObj) {

			if(paramObj == null) {
				console.log("!Error! / getVideo / paramObj == null");
				return;
			}
			if(paramObj.paramObj == null) {
				console.log("!Error! / getVideo / paramObj.paramObj == null");
				return;
			}

			// wonder.jung
			FB.api(
				"/{video-id}".replace(/\{video\-id\}/gi, paramObj.objectId),
				{"fields":"id,description,updated_time,embed_html,embeddable,from,length,picture,source,published"},
				function (response) {

					paramObj.paramObj.video = response;

					if (response && !response.error) {

						paramObj.callback.apply(paramObj.callbackScope,[paramObj.paramObj]);

					}

				}
			); // end FB api

		} // end callback
		var callbackScope = this;

		if(!this.isLogIn) {

			// if not logged in, log in.
			this.logIn(function(paramObj) {

				this.getPageAccessTokenAsync(callback, callbackScope, nextParamObj);

			}, this, nextParamObj);

		} else {

			this.getPageAccessTokenAsync(callback, callbackScope, nextParamObj);

		}

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

		var _self = this;
		var callback = function(paramObj) {

			if(paramObj == null) {
			console.log("!Error! / getPagePosts / paramObj == null");
			return;
			}

			console.log("HERE / 001 / paramObj ::: ",paramObj);

			// write the page post after getting Page Access Token
			FB.api(
				"/{page-id}/promotable_posts".replace(/\{page\-id\}/gi, paramObj.pageId),
				"GET",
				{"fields":"id,created_time,shares,type,status_type,properties,object_id,message,is_published,from,icon,link,is_hidden"},
				function (response) {

					console.log("promotable_posts / response ::: ",response);

					if (response && !response.error) {
						/* handle the result */

						var postList = response.data;

						// check post object and its type
						if(postList != null && 0 < postList.length) {

							var asyncCnt = 0;
							for(var idx = 0; idx < postList.length; idx++) {

								var postObj = postList[idx];

								// REMOVE ME
								// console.log("promotable_posts / postObj ::: ",postObj);
								// console.log("promotable_posts / paramObj ::: ",paramObj);

								var objectType = postObj.type;
								var nextParamObjPost = {
									callback:callback
									, callbackScope:callbackScope
									, paramObj:paramObj
									, pageId:paramObj.pageId
									, objectId:postObj.object_id
									, objectType:objectType
									, postListIdx:idx
									, postListCnt:postList.length
									, postObj:postObj
									, postList:postList
								}

								// CHECK TYPE

								// REMOVE ME
								// console.log("objectType ::: ",objectType);

								// objectType : link, status, photo, video, offer
								if("photo" === objectType) {

									// fecth photo resource url
									var callbackPhoto = function(paramObj) {

										asyncCnt++;

										paramObj.postObj.photo = paramObj.photo;

										if(asyncCnt === paramObj.postListCnt) {
											console.log("DONE!");
											paramObj.callback.apply(paramObj.callbackScope,[paramObj.postList]);
										}

									}
									var callbackScopePhoto = this;

									_self.getPhoto(callbackPhoto, callbackScopePhoto, nextParamObjPost);

								} else if("video" === objectType) {

									var callbackVideo = function(paramObj) {

										asyncCnt++;

										paramObj.postObj.video = paramObj.video;

										if(asyncCnt === paramObj.postListCnt) {
											console.log("DONE!");
											paramObj.callback.apply(paramObj.callbackScope,[paramObj.postList]);											
										}

									}
									var callbackScopeVideo = this;

									_self.getVideo(callbackVideo, callbackScopeVideo, nextParamObjPost);

								} else if("status" === objectType) {

									asyncCnt++;

								} else if("link" === objectType) {

									asyncCnt++;

								} else if("offer" === objectType) {

									asyncCnt++;

								} else {

									asyncCnt++;

								} // end if

							} // end for

					  	} // end if


					} else {
						// TODO
					  	/* handle the error */

					}

				} // End callback

			); // End FB.api      

		}
		var callbackScope = this;

		if(!this.isLogIn) {

			// if not logged in, log in.
			this.logIn(function(paramObj) {

				console.log("HERE / 001 / paramObj ::: ",paramObj);

				this.getPageAccessTokenAsync(callback, callbackScope, paramObj);

			}, this, nextParamObj);

		} else {

			console.log("HERE / 002 / nextParamObj ::: ",nextParamObj);

			this.getPageAccessTokenAsync(callback, callbackScope, nextParamObj);

		}

	}
	// @ Private
	, pageAccessToken:{
		pageId:""
		,accessToken:""
	}
	, getPageAccessTokenAsync:function(callback, callbackScope, paramObj, forceToUpdate) {

		if(callback == null) {
			console.log("!Error! / getPageAccessTokenAsync / callback == null");
			return;
		}
		if(callbackScope == null) {
			console.log("!Error! / getPageAccessTokenAsync / callbackScope == null");
			return;
		}

		if(paramObj == null) {
			console.log("!Error! / getPageAccessTokenAsync / paramObj == null");
			return;
		}
		if(paramObj.pageId == null && this.pageAccessToken.pageId != "") {
			paramObj.accessToken = this.pageAccessToken.accessToken;
			callback.apply(callbackScope, [paramObj]);
			return;
		}
		var pageId = paramObj.pageId;
		if(_v.is_not_valid_str(pageId)) {
			console.log("!Error! / getPageAccessTokenAsync / _v.is_not_valid_str(pageId)");
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

		if (iframeId.addEventListener) {
			iframeId.addEventListener('load', eventHandler, true);	
		}
		if (iframeId.attachEvent) {
			iframeId.attachEvent('onload', eventHandler);	
		}

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

			} // end for

		} // end if

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


	// REMOVE ME
	// @ Public
	/*
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

				if (response && !response.error) {

				} else {

				}
			}
		); // End FB.api

	}
	*/


	// REMOVE ME
	// @ Public
	/*
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

				}
			}
		);
	}
	*/
	// REMOVE ME
	// @ Public
	/*
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
		    {"message":message},        
		    function (response) {

				console.log("writePagePostVisitor / response ::: ",response);

				if (response && !response.error) {

				}
		    }
		); // end api
	}
	*/	

}

