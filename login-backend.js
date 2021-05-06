export const handlePage = function () {
    let $root = $('#root');
    $root.on('click', '.login-button', handleLoginButton);
}

export const handleLoginButton = function () {
    let $username = $('.username-input');
    let $password = $('.password-input');
    let $missing = $('.missing');
    let object;
    $missing.empty();
    if ($username.val() == null || $username.val() == "") {
        $missing.append('<div>Please fill out your username');
    } else if ($password.val() == null || $password.val() == "") {
        $missing.append('<div>Please fill out your password</div>');
    } else {
        db.collection("users").where("username", "==", $username.val()).get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                object = (doc.data());
            })
            if (object == null) {
                $missing.append(`<div>User does not exist</div>`);
            } else if (object.password != $password.val()) {
                    $missing.append(`<div>Password is incorrect</div>`);
            } else {
                localStorage.setItem("username", $username.val());
                localStorage.setItem("score", object.highscore);
                window.location = "./"
            }
        });
    }


}

$(function () {
    handlePage();
});