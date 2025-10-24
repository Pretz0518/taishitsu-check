// ページの読み込みが完了したら実行する
document.addEventListener('DOMContentLoaded', function() {

    // HTMLの要素（部品）を取得
    const checkPage = document.getElementById('check-page');
    const resultButton = document.getElementById('show-result-button');
    const backButtons = document.querySelectorAll('.back-button');

    // 結果ページの全要素を取得
    const resultPages = document.querySelectorAll('.result-page');

    // 「結果を見る」ボタンが押された時の処理
    resultButton.addEventListener('click', function() {
        // 1. 各タイプのチェック数を数える
        const counts = {
            kan: document.querySelectorAll('.type-kan:checked').length,
            shin: document.querySelectorAll('.type-shin:checked').length,
            hi: document.querySelectorAll('.type-hi:checked').length,
            hai: document.querySelectorAll('.type-hai:checked').length,
            jin: document.querySelectorAll('.type-jin:checked').length
        };

        // 2. 年齢を取得する
        const age = document.querySelector('input[name="age"]:checked').value;

        // 3. 判定ロジックを実行する
        const finalType = getFinalType(counts, age);

        // 4. 対応する結果ページを表示する
        showResultPage(finalType);
    });

    // 「戻る」ボタンが押された時の処理
    backButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // すべての結果ページを隠す
            resultPages.forEach(function(page) {
                page.style.display = 'none';
            });
            // チェックリストページを再表示
            checkPage.style.display = 'block';
        });
    });

    /**
     * チェック数と年齢から最終的な体質タイプを判定する関数
     * @param {object} counts - 各タイプのチェック数
     * @param {string} age - 'under45' または 'over45'
     * @returns {string} - 最終的なタイプ名 ('kan', 'shin', 'hi', 'hai', 'jin')
     */
    function getFinalType(counts, age) {
        // 資料に基づく優先順位
        const priorityOver45 = ['jin', 'hi', 'shin', 'kan', 'hai']; // 45歳以上 [cite: 155]
        const priorityUnder45 = ['hi', 'kan', 'shin', 'hai', 'jin']; // 45歳未満 [cite: 157]

        let maxCount = 0;
        let topTypes = []; // 最高得点のタイプを格納する配列

        // 1. 最高得点を調べる
        for (const type in counts) {
            if (counts[type] > maxCount) {
                maxCount = counts[type];
            }
        }

        // 2. 最高得点と「同数」のタイプをすべてリストアップする [cite: 153]
        for (const type in counts) {
            if (counts[type] === maxCount) {
                topTypes.push(type);
            }
        }

        // 3. 判定
        if (topTypes.length === 1) {
            // 同数がなければ、それが結果
            return topTypes[0];
        } else {
            // 同数の場合は、年齢別の優先順位リストを使って判定する
            const priorityList = (age === 'over45') ? priorityOver45 : priorityUnder45;
            
            // 優先順位リストを最初からチェックし、
            // topTypes（同点リスト）に最初に見つかったものを採用する
            for (const type of priorityList) {
                if (topTypes.includes(type)) {
                    return type; // 優先順位が最も高いタイプを返す
                }
            }
        }
    }

    /**
     * 指定されたタイプの結果ページを表示する関数
     * @param {string} type - 表示するタイプ名
     */
    function showResultPage(type) {
        // 1. チェックリストページを隠す
        checkPage.style.display = 'none';

        // 2. すべての結果ページを一旦隠す
        resultPages.forEach(function(page) {
            page.style.display = 'none';
        });

        // 3. 該当する結果ページだけを表示する
        const resultPageId = 'result-' + type;
        const targetPage = document.getElementById(resultPageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            // ページの一番上にスクロール
            window.scrollTo(0, 0);
        }
    }

});