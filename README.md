# PPM_BookTracker
<h1 align="center">Book Tracker</h1>

## Përshkrimi
Ky projekt paraqet një koncept aplikacioni mobil për menaxhimin e librave që përdoruesit i kanë lexuar, janë duke i lexuar ose dëshirojnë t’i lexojnë.  
Aplikacioni **Book Tracker** synon të ndihmojë përdoruesit të organizojnë librat dhe të ruajnë motivimin për lexim të përditshëm.

---
## Funksionalitetet kryesore
- **Regjistrimi dhe krijimi i profilit të përdoruesit** (me email ose GitHub)
- **Shtimi i librave** me detaje si titulli, autori dhe foto e kopertinës (nga kamera ose galeria)
- **Vendosja e statusit të librit:** “Duke lexuar”, “I përfunduar” ose “Për t’u lexuar”
- **Kujtesa ditore për lexim**, që e nxit përdoruesin të lexojë të paktën 10 minuta çdo ditë
- **Ndjekja e progresit** të leximit dhe statistika personale

---
## Teknologjitë e përdorura
- **React Native** me Expo
- **Firebase** (Authentication dhe Firestore)
- **Expo Router** për navigim
- **AsyncStorage** për ruajtje lokale

---
## Udhëzime për Instalim dhe Nisje të Projektit

**Hyr në folderin e projektit** (nëse tashmë e ke shkarkuar/klonuar repository-n)
   ```bash
   cd PPM_BookTracker
   ```
 **Instalo dependencat**
   ```bash
   npm install
   ```
 **Nis projektin me Expo**
 ```bash
npx expo start
```
***Shënim: Nëse hasni problem me Metro cache (p.sh. gabim "Unable to deserialize cloned data"), niseni me cache të pastruar:***
```bash
npx expo start --clear
```

## Screenshots:

![test1](https://github.com/user-attachments/assets/a05fc026-6453-4287-a0bb-d7296b306d30)
 ![test2](https://github.com/user-attachments/assets/0d96a1bc-c125-41b3-a3fc-e0274871044a)
![test3](https://github.com/user-attachments/assets/187aa26c-6bb4-4738-b30a-9ff816d1330f)
![test4](https://github.com/user-attachments/assets/01e4a211-50c8-4ea2-96ac-c851333db6be)
![test5](https://github.com/user-attachments/assets/a932f068-f00c-4b66-8923-510c3acdad54)
![test6](https://github.com/user-attachments/assets/42423e03-87d6-4b2a-82e8-497c1e35e224)
![test7](https://github.com/user-attachments/assets/bdd1a666-044c-4f3a-be73-b900e3a1e8f7)
![test8](https://github.com/user-attachments/assets/1b23b51d-a79b-4679-b94f-e037df60d3dc)
![test9](https://github.com/user-attachments/assets/93654999-ca16-48b8-b987-dbaffdb28565)
![test10](https://github.com/user-attachments/assets/ddfb39e4-3f5d-43c2-ba98-a2ae356faf2d)
![test11](https://github.com/user-attachments/assets/f701f24f-0213-4624-a1d2-59fa65898f3e)

