// Change the configurations.  
var config = {
    apiKey: "AIzaSyBvkGOd24ZvrpLYTIjU7moPntfTAEhM23M",
    authDomain: "jiyoun-8a088.firebaseapp.com",
    databaseURL: "https://jiyoun-8a088.firebaseio.com",
    projectId: "jiyoun-8a088",
    storageBucket: "jiyoun-8a088.appspot.com",
    messagingSenderId: "522692516536"
}

// Initialize Firebase.
firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

new Vue({
    el: "#app",
    firestore() {
        return {
            bio: firebase.firestore().collection("bio"),
            development: firebase.firestore().collection("development"),
        }
    },
    data(){
        return {
            emailSent: false,
            message: {
                from_name: '',
                user_email: '',
                subject_html: '',
                message_html: ''
            },
            currentTab: 1,
            viewing: "",
            viewOpen: false,
            infoActive: false,
            infoAmount: 'More info',
            enter: false,
            exit: false,
            displayLoader: true,
            options: {
                //parent: this,
                afterLoad: this.handleLoad,
                onLeave: this.handleLeave,
                navigation: false,
                slidesNavigation: true,
                slidesNavPosition: 'bottom',
                navigationPosition: 'left',
                parallax: true,
                lazyLoading: false,
                scrollingSpeed: 700,
                anchors:["home","ux","development","animation","graphicdesign","photography","art","contact"],
            },
            userBio: {
                photo: "",
                resumeLink: "",
                text: "o hai"
            },
            item: {
                title: "",
                genre: "",
                summary: "",
                finalFilm: "",
                credits: [
                    {
                        role: "",
                        name: ""
                    }
                ],
                screenGrabs: [
                    ""
                ]
            }
        }
    },
    mounted: function() {

        //----- Loading component and initializing fullpage -----

        var parentObj = this

        setTimeout(function() {
            //-----set all dynamic content after delay-----
            parentObj.setBio();
            parentObj.setItems();
            parentObj.componentsReady();
            parentObj.removeLoader();
        }, 1000);
    },
    methods: {
        componentsReady() {
            console.log('fullpage initialized');

            //----------LOADER DONE----------

            this.$refs.fullpage.init()
            this.$refs.fullpage.build()

            //console.log(parentObj.bio);

            /*ui.start('#firebaseui-auth-container', {
                signInOptions: [
                  firebase.auth.EmailAuthProvider.PROVIDER_ID
                ],
                // Other config options...
            });*/
        },
        setBio() {
            //console.log(parentObj.bio[0].text);
            this.userBio.text = this.bio[0].text;
            this.userBio.photo = this.bio[0].photo;
        },
        setItems() {
            //console.log(this.development[0].title);

            console.log("items set");
        },
        navigate(section) {
            this.$refs.fullpage.api.moveTo(section);
            this.currentTab = section;
            console.log(this.currentTab);
        },
        add() {
            //console.log('clicked')
            this.$firestore.items.add(this.item).then(()=>{
                this.item.title = "",
                this.item.genre = "",
                this.item.summary = "",
                this.item.finalFilm = "",
                this.item.credits = [
                    {
                        role: "",
                        name: ""
                    }
                ],
                this.item.screenGrabs = [
                    ""
                ]
            })

            //refresh page
            document.location.reload();
        },
        remove(e) {
            //console.log(e.screenGrabs);

            //deleting screenGrab directory in storage


            /* ---------- TODO ---------- */


            /*for(let i = 0; i < e.screenGrabs.length; i++) {
                firebase.storage().ref().child(e.imgPaths[i]).delete().then(function() {
                    console.log("Image deleted successfully");
                }).catch(function(error) {
                    console.error("Image not deleted successfully");
                });
            }*/

            //deleting item from database
            this.$firestore.items.doc(e['.key']).delete().then(
                function() {
                    //refresh page
                    document.location.reload();       
                }
            )
        },
        newCredit() {
            this.item.credits.push(
                {
                    role: "",
                    name: ""
                }
            );
        },
        newScreenGrab() {
            //console.log("pushed new screengrab")
        },
        handleUpload(e) {
            //console.log("...handling screengrab upload for " + this.item.title);

            var parentObj = this;

            var file = e.target.files[0];

            var imgPath = this.item.title + "/" + file.name;

            //create a storage ref
            var storageRef = firebase.storage().ref(imgPath);

            //upload file
            var task = storageRef.put(file);

            //update progress bar
            task.on('state_changed', 
            
                function progress(snapshot) {
                    //var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                   //uploader.value = percentage;
                },
                function error(err) {
                    
                },
                function complete() {
                    //console.log(storageRef.child(imgPath).getDownloadURL().getResults());

                    task.snapshot.ref.getDownloadURL().then(
                        function(downloadURL) {
                            //console.log('File available at: ' + downloadURL)
                            parentObj.item.screenGrabs.push(
                                downloadURL + ""
                            );
                            //console.log('screenGrabs' + parentObj.item.screenGrabs);
                        }
                    )

                    //console.log("screenGrabs: " + parentObj.item.screenGrabs);
                }
            
            )

        },
        handleFilmUpload(e) {
            //console.log("...handling film upload for " + this.item.title);

            var parentObj = this;

            var file = e.target.files[0];

            var filmPath = this.item.title + "/" + file.name;

            //create a storage ref
            var storageRef = firebase.storage().ref(filmPath);

            //upload file
            var task = storageRef.put(file);

            //update progress bar
            task.on('state_changed', 
            
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    uploader.value = percentage;

                    if(percentage == 100) {
                        uploader.style.background = "#66BB6A";
                    }
                },
                function error(err) {
                    
                },
                function complete() {
                    //console.log(storageRef.child(imgPath).getDownloadURL().getResults());

                    task.snapshot.ref.getDownloadURL().then(
                        function(downloadURL) {
                            //console.log('File available at: ' + downloadURL)
                            parentObj.item.finalFilm = downloadURL + ""
                        }
                    )

                    //console.log("video: " + parentObj.item.screenGrabs);
                }
            )
        },
        removeLoader() {
            //console.log("goodbye loader");
            this.displayLoader = false;
        },
        handleLeave(destination, direction) {
            //console.log('left');
            this.displayVeil = true;
            this.infoActive = false;
            this.enter = false;
            this.watch = false;

            console.log("going to: " + (direction.index + 1))

            this.currentTab = direction.index + 1;
            //console.log('enter?: ' + this.enter);

            //console.log("direction: " + direction);

            //console.log('begin animation');
        },
        handleLoad(destination, direction) {
            //console.log("Emitted 'after load' event");
            this.enter = true;
            //console.log(direction.index + 1);

            this.currentTab = direction.index + 1;

            //this.$forceUpdate();

            console.log("forced update");
        },
        toggleInfo() {
            if(this.infoActive) {
                this.infoActive = false
                this.infoAmount = 'More info'
            }
            else {
                this.infoActive = true
                this.infoAmount = 'Less info'
            }
            //console.log("info active: " + this.infoActive);
        },
        toggleWatch() {
            this.watch = !this.watch;
            //console.log('watch?: ' + this.watch);
            if(this.watch) {
                this.vidTime = 0;
                this.options.navigation = false;
            }
            else {
                this.vidTime = 85;
                this.options.navigation = true;
            }  
            //console.log(this.options);
        },
        toggleView(e) {
            this.viewing = e.target.src;
            this.viewOpen = !this.viewOpen;
        },
        handleSubmit() {
            this.emailSent = true;
            this.message.from_name = '';
            this.message.user_email = '';
            this.message.subject_html = '';
            this.message.message_html = '';
        },
        sendEmail: (e) => {
            emailjs.sendForm('gmail', 'template_zlljjLwb', e.target, 'user_kTZviK8cM7UnEbWOUl1bX')
              .then((result) => {
                  console.log('SUCCESS!', result.status, result.text);

                  e.target.querySelector("input[type='submit']").style.borderColor = "#66BB6A";
                  e.target.querySelector("input[type='submit']").style.color = "#66BB6A";
                  e.target.querySelector("input[type='submit']").style.background = "transparent !important";
                  e.target.querySelector("input[type='submit']").style.pointerEvents = "none";
                  e.target.querySelector("input[type='submit']").value = "✓ Message sent";
                  
              }, (error) => {
                  console.log('FAILED...', error);
              });
          }
    }
})