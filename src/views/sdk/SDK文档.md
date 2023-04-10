# Java SDK

此 SDK 适用于 SpringBoot2 及以上版本。使用此 SDK
构建您的网络应用程序，能让您以非常便捷地方式将数据安全地存储到MyOss上。无论您的网络应用是一个网站程序，还是包括从云端（服务端程序）到终端（手持设备应用）的架构服务或应用，通过MyOss及其
SDK，都能让您应用程序的终端用户高速上传和下载，同时也让您的服务端更加轻盈。

#### 使用

在pom.xml文件中引入

```
<dependency>
  <groupId>io.github.gyyst</groupId>
  <artifactId>MyOss-SDK</artifactId>
  <version>0.0.2</version>
</dependency>
```

在application.yml中配置access-key与secret-key。（若无access-key与secret-key可以登录MyOss申请access-key与secret-key）

```java
myoss:
        config:
        access-key:<your access-key>
        secret-key:<your secret-key>

```

#### 文件上传

```java
//单文件上传，将整个文件上传
String bucket="bucket name";
//此处fileName为上传至MyOss中的名字，以/开头
        String fileName="/fileName";
        FileInfo fileInfo=new FileInfo(bucket,fileName);
//同样支持MultipartFile上传
        File file=new File("D:\\a.png");
        BaseResponse baseResponse=myOssClient.uploadFileByForm(fileInfo,file);

//文件分片上传，将大文件分片上传,不支持MultipartFile上传
        FileInfo fileInfo=new FileInfo(bucket,fileName);
        File file=new File("D:\\a.png");
        BaseResponse baseResponse=myOssClient.uploadFileBySlice(fileInfo,file);

//当baseResponse.getCode()==0时请求成功
```

#### 文件下载

```java
String bucket="bucket name";
        String fileName="/fileName";
//当你的bucket为private时，需要设置expireTime，否则无效
//如果为public，则传入null即可
        Integer expireTime=null;
        FileInfo fileInfo=new FileInfo(bucket,fileName);
        BaseResponse baseResponse=myOssClient.getDownloadFileURL(fileInfo,expireTime);
//当baseResponse.getCode()==0时请求成功
        String downloadUrl;
        if(baseResponse.getCode()==0){
        downloadUrl=(String)baseResponse.getData();
        }
```

#### 文件删除

```java
String bucket="bucket name";
        String fileName="/fileName";
        FileInfo fileInfo=new FileInfo(bucket,fileName);
        BaseResponse baseResponse=myOssClient.deleteFile(fileInfo);
//当baseResponse.getCode()==0时请求成功
```

#### 文件备份

```java
String bucket="bucket name";
        String fileName="/fileName";
        FileInfo fileInfo=new FileInfo(bucket,fileName);
//备份文件
        BaseResponse baseResponse=myOssClient.backupFile(fileInfo);
//删除备份文件
        BaseResponse baseResponse=myOssClient.delBackupFile(fileInfo);
//恢复备份文件
        BaseResponse baseResponse=myOssClient.recoverBackupFile(fileInfo);
```
