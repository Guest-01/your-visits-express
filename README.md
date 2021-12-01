# your-visits-express
간단한 웹사이트를 만들면서 여러 언어/프레임워크를 비교해보자 - NodeJS/Express편
- python/flask편 [바로가기](https://github.com/Guest-01/your-visits-flask)

### 웹사이트 요구사항 - 공통
1. 클라이언트의 IP를 기반으로 방문수를 DB에 저장한다
2. 회원가입 시, 현재 IP를 회원에게 귀속하고 방문수를 승계한다.
3. 다른 IP로 접속해도 로그인을 하면 회원정보에 추가해 방문수를 합산한다.

**(완성 스크린샷)**   
![image](https://user-images.githubusercontent.com/49602144/144182201-f1ea7e51-3837-4e1a-bb7d-d8aaf7ab13d7.png)

---
### Express 후기
1. 의존성 관리
> NPM을 통해 `package.json`파일 하나로 모든걸 관리할 수 있다. `node_modules`라는 폴더안에 의존 패키지들이 설치된다.
2. 프레임워크 특징
> Express는 Micro-Framework으로 볼 수 있다. `request`를 받아서 `response`로 가기까지의 모든 과정을 `middleware`로 처리하는 형태이다. 쿠키나 세션, 로깅 그리고 궁극적으로 라우팅까지도 일종의 미들웨어라고 볼 수 있다. 이런 점에서 프레임워크의 일관적인 구조를 느낄 수 있고 새로운 기능을 추가하는 것에 진입장벽이 낮은 편이다. 다만 내장되어있는 것이 별로 없으므로 여러가지 미들웨어를 별도로 설치해 추가해야하지만 딱히 번거롭다는 느낌이 들지 않았다.
3. DB(ORM) 사용 방식은 어떤가? (One-to-many 관계 설정 등)
> 현재 가장 인기있는 ORM은 `sequelize` 패키지이다. `sequelize-cli`를 통해 migration을 기록할 수 있으며, 다만 python/flask에 비해 사용방법이 조금 더 복잡하다. 특히 모델과 마이그레이션 스크립트를 둘 다 직접 작성해야한다는 번거로움이 있다. flask에서는 내가 정의하거나 수정한 모델이 있으면 자동으로 migration 파일을 만들어주는데 sequelize는 `model:generate` 명령어를 통해 모델을 만들때만 migration을 만들어준다.
4. request에 대한 정보는 어떻게 얻을 수 있는가 (클라이언트 IP, 헤더정보 등)
> 미들웨어 방식이기 때문에 파라미터로 전달되는 `req` 안에 모든 것이 담겨있다. 일부 정보는 별도의 parser 미들웨어를 장착해야 얻을 수 있다. 예를 들어 클라이언트가 보내는 POST body의 경우 `body-parser` 미들웨어를 설정해놓아야 `req.body`로 읽을 수 있는 식이다. 하지만 미들웨어 설치가 `app.use()`로 무척 간단하기 때문에 단점이라 볼 순 없다.
5. 로그인, 세션관리는 어떻게 이루어지는가
> 로그인을 처리하는 `passport.js`라는 패키지가 있는데 이걸 사용해도 되고, 혹은 `express-session` 미들웨어를 장착한 후 `req.session`으로 접근해 직접 다룰 수도 있다.
7. 로깅은 어떻게 할 수 있는가
> 로깅조차 미들웨어로 만들어져있으며 `morgan`이라는 패키지를 설치하면 된다.
9. 배포는 편리한가
> 내장된 http 서버가 production 용으로도 사용된다. 따라서 서버가 멈추면 재시작할 수 있도록 프로세스 매니저 정도만 추가로 사용해주면 된다. `nodemon`(개발용) 혹은 `pm2`가 많이 쓰인다.

End.
