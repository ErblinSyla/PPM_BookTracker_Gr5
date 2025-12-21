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

 
