# **U19 Data Sharing Portal (USArhythms, aABC)**

***Centralised Portal*** aims to warehouse meta-data about shared research, including indexing, searching and pointers to code/visualization tools

***Production Deployments***:
- https://usarhythms.ucsd.edu/ (USArhythms U19 Portal)
- https://highandlow.dk.ucsd.edu/ (aABC U19 Portal)

## Steps for setup:

    1. Install node.js (Note: Requires Angular v. 14)
    2. Clone repository
    3. Compile typescript into SWA
    4. Start local version: ng run serve

## Backend notes:

-You will need to create connection to API endpoints in files under src/environment/ [env_dev.ts, env_prod.ts, env.ts]; see env_template.ts

## Features

---

- Permits user login to data sharing portal
- Provides user input form for experimental meta-data
- Provides user search form for locating previously-entered data


## Future goals

---
- Add basic visualizations for common data formats
- Add API for external/automated experimental data additions


## Support

---

If you are having issues, please let me know.
Duane Rinehart - drinehart@ucsd.edu

## License

---
The project is licensed under the [MIT license](https://mit-license.org/).
