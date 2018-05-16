window.onload(()=> {
    const accountComponent = new Vue({
        el: "#app",
        data: {
            userName: "Test",
            avatarImgLink: "https://api.adorable.io/avatars/285/abott@adorable.png",
            newPreference: "",
            preferenceList: ["Vegetarian", "Vegan"],
            newAlergy: "",
            alergyList: ["Egg", "Nut", "Soy"]
        },
        methods: {
            addPreference: function (preference) {
                this.preferenceList.push(preference);
                this.newPreference = "";
            },
            removePreference: function (preference) {
                for (i = 0; i < this.preferenceList.length; i++) {
                    if (preference === this.preferenceList[i]) {
                        this.preferenceList.splice(i, 1);
                    }
                }
            },
            addAlergy: function (alergy) {
                this.alergyList.push(alergy);
                this.newAlergy = "";
            },
            removeAlergy: function (alergy) {
                for (i = 0; i < this.alergyList.length; i++) {
                    if (alergy === this.alergyList[i]) {
                        this.alergyList.splice(i, 1);
                    }
                }
            },
            isPEmpty: function() {
                return this.preferenceList.length != 0;
            },
            isAEmpty: function() {
                return this.alergyList.length != 0;
            },
            updateInfo: function() {
                alert("Account Information Updated!");
            }
        }
    });
})