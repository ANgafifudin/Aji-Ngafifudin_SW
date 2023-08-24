# Todo List Backend App

## Menjalankan Base Project
- Jalankan perintah ```npm i``` atau ```npm install ``` untuk menginstal package yang dibutuhkan.
- Kemudian jalankan perintah ```npm run dev``` untuk menjalankan aplikasinya.
- Kemudian coba hit server dari cmd ```curl --location 'http://localhost:10001/api/v1/test'```

## Auth
- Login ```POST``` ```http://http://localhost:10001/api/v1/auth/login```
- Register ```POST``` ```http://http://localhost:10001/api/v1/auth/register```

## CRUD
- Create Task ```POST``` ```http://localhost:10001/api/v1/task```
- Read All Task ```GET``` ```http://localhost:10001/api/v1/task```
- Read 1 Task ```GET``` ```http://localhost:10001/api/v1/task/:id```
- Update Task ```PUT``` ```http://localhost:10001/api/v1/task/:id```
- Delete Task ```DELETE``` ```http://localhost:10001/api/v1/task/:id```
