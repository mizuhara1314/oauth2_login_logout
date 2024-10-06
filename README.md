# 1. 簡介
基於google-passport-oauth2來實現三方授權登入和登出，並結合jwt認證技術，根路由是chatroom

# 2. 效果：

https://github.com/user-attachments/assets/3b6dcf56-6e3a-48b4-ac8a-a61f66ae1037


# 3. 運行項目：

先去gcp_console註冊oauth憑證，設定重定位網址，並取得客戶id跟密鑰

![image](https://github.com/user-attachments/assets/ca6f6d58-3da7-4765-89fe-b11d48bc31ef)



再去後端項目下的.env文件添加環境變量(git上傳敏感訊息有限制所以自己操作)

![image](https://github.com/user-attachments/assets/674a8f43-e4c4-41dc-ad60-d08b22140eaa)


在docker-compose目錄下運行代碼：

```bash
docker-compose up 
```
運行mongodb與mysql

在後端項目下運行代碼：

```bash
npm install
node app.js 
```
在port 3000運行

在react前端項目下

```bash
npm install
npm start
```

在port 5000運行


然後在瀏覽器開啟localhost/3000即可：
# 4. 踩坑：

**資料庫字串:** 不知道到使用到admin帳戶權限後面要添加authsource=admin


**根路由設定:** 先前看過很多電商設計，一直以為login是應用根路由，但跟目前市面上許多應用登陸驗證邏輯衝突，後面想了很久才知道根路由應該是先導向內部，
之後用jwt驗證來是否導向login路由


**登出功能:** 登出後點擊登入還是能不用授權就登入，目前很多應用也有這問題(cakeResume)，查了很久才知道要加上prompt參數以及搭配內部jwt等技術實現

# 5. 改進

目前通訊部分還沒做，之後會設計基於mySql儲存使用者註冊資料，redis暫存聊天室最新50筆數據，串接Google Cloud Vision API過濾不當圖片




