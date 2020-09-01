Subject-sniper
---------------


- purpose

  - 관찰 대상의 과목을 polling하다가, 빈 자리가 생기면 chrome alert를 띄워줍니다.

- installation

  - npm install


- run

  - node app.js & npm run start
  - localhost:3000 에서 실행됩니다.


- configuration setting

  - file name : configuration.js
  - list 내의 하나하나의 object가 수강신청하려는 과목입니다.
  - object의 구성요소는 다음과 같습니다.
    - id : 과목 번호
    - profName : 교수의 성함
    - polling_interval : polling을 실행하는 주기. 단위는 ms입니다.