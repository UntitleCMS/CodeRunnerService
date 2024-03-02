## บริการรันโค้ด

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

## การติดตั้ง

1. ดาวน์โหลดผ่าน [ลิงก์](https://github.com/UntitleCMS/CodeRunnerService/releases) หรือใช้คำสั่ง

```bash
$ git clone https://github.com/UntitleCMS/CodeRunnerService.git
```

2. ติดตั้ง dependencies

```bash
$ npm install
```

## เปิดเซิฟเวอร์เพื่อพัฒนา

1. เปิด sandbox เพื่อใช้ทดลองรันโค้ดจากผู้ใช้ด้วยคำสั่ง

```bash
$ docker compose up python-slave  // สำหรับ Python sandbox
$ docker compose up gcc-slave     // สำหรับ GCC sandbox
$ docker compose up java-slave    // สำหรับ Java sandbox
```

2. รันแอพลิเคชั่น CodeRunnerService แบบตรวจจับการเปลี่ยนแปลง

```bash
# watch mode
$ npm run start:dev
```

หลังจากนี้ระบบจะตรวจจับการเปลี่ยนแปลงและรันแอปพลิเคชั่นให้อัตโนมัติ

3. รันระบบผ่าน Docker

```bash
$ docker compose up
[+] Running 4/4
 ✔ Container code-runner-runner-1        Created                                                                                              0.1s 
 ✔ Container code-runner-java-slave-1    Created                                                                                              0.0s 
 ✔ Container code-runner-python-slave-1  Created                                                                                              0.0s 
 ✔ Container code-runner-gcc-slave-1     Created
```
