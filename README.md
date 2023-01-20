# Discord react clone

DEMO：[Github Page](https://pioneer101.github.io/discord-clone)

可以先點進來玩玩看。

# 背景

一開始是打算用 React + WebRTC 實現一個 Discord。不過由於諸多原因延誤最後只進行了一部分刻板的部分。

# 過程痛點

原本以為這個板刻起來難度不高，那個看起來很常見的側邊攔難度夭壽高。

## 拖拉效果

首先是實現拖拉效果，先確定需求：

-   可以插入指定位置
-   可以與 非資料夾 和 資料夾內伺服疊 成資料夾

原本有先尋找網路上有實現的拖移庫。（e.g. react-dnd）

第一個用現成的庫還可以解決，但第二項要實現的拖移功能場景過於複雜，不只是單純的換位置、或放進某個 Element 裡，需要同時做到兩件事情，還得判斷是否處於某個資料夾裡。所以只好放棄抄捷徑的想法，手動造輪。

剛開始想了兩個方案：

一個是紀錄單獨 ServerItem 的座標，依照座標判斷，他處於 Item 的上中下段，上下段決定插入位置，中段決定合併為資料夾。

但是這種持續監聽 mousemove 的行為很吃性能，沒辦法做得跟本家一樣絲滑。

之後就想說能不能在 Item 上方覆蓋三個垂直平均分布看不見的 Div 只要判斷進到哪個 Div 就可以判斷位於哪段。

然後跑去看了本家的實現：

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1065579919502999643/1065579941665714247/image.png">
</p>

本家思路也是一樣，接下來只要實現就好了。不過 discord 在中途有改版，改上圖這種二格版本，後來也跟著重構了 2 格版本。倒是簡化了不少邏輯。

三格版本時要判斷：

Item 對 Item
上
下
中 合併
in Folder Item 不顯示中

Folder 對 Item
上
Folder 插入
Item 插入
下
不得為 Folder && in Folder Item
Item 插入
last in Folder Item 插入
中
無

Item 對 Folder
上下
上 插入 Folder 上方
下 加入 Folder 第一
中 加入 Folder 最後
