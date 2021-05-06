export const handlePage = function () {
    let $leaderboard = $('.leaderboard-table');
    let count = 1;
    let username;
    let score;
    let lb = db.collection("users").where("highscore", "!=", 0).orderBy("highscore", "desc").limit(10);
    lb.get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            username = doc.data().username;
            score = doc.data().highscore;
            $leaderboard.append(`<tr>
                                    <th class=leaderboard-username>${count}. ${username}</th>
                                    <th>${score}</th>
                                 </tr>`);
            count++;
        })
    });
}

$(function () {
    handlePage();
});