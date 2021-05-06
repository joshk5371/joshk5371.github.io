export const handlePage = function () {
    let $root = $('#root');
    $root.on('click', '.register-button', handleRegisterButton);
}

export const handleRegisterButton = function () {
    let $username = $('.username-input');
    let $password = $('.password-input');
    let $missing = $('.missing');
    $missing.empty();
    if ($username.val() == null || $username.val() == "") {
        $missing.append('<div>Please fill out your username');
    } else if ($password.val() == null || $password.val() == "") {
        $missing.append('<div>Please fill out your password</div>');
    } else {
        db.collection("users").doc($username.val()).get().then((snapshot) => {
            if (snapshot.exists) {
                $missing.append('<div>This username is already taken</div>');
            } else {
                db.collection("users").doc($username.val()).set({
                    username: $username.val(),
                    password: $password.val(),
                    highscore: 0
                }).then(() => {
                    localStorage.setItem("username", $username.val());
                    localStorage.setItem("score", 0);
                    window.location = "./"
                })
            }
        });
    }
}

$(function () {
    handlePage();
});