"use client";

import { ScrollArea } from '@mantine/core';
import NavbarLinksGroup from 'components/NavbarLinksGroup/NavbarLinksGroup';
import classes from './NavbarNested.module.css';

const NavbarNested: React.FC = () => {
    const links = [
        {
            "label": "Games",
            "initiallyOpened": true,
            "links": [
                {
                    "label": "Next Game",
                    "link": "/footy/nextgame",
                },
                {
                    "label": "Results",
                    "link": "/footy/results",
                },
                {
                    "label": "Fixtures",
                    "link": "/footy/fixtures",
                },
            ],
        },
        {
            "label": "Tables",
            "initiallyOpened": true,
            "links": [
                {
                    "label": "Winners",
                    "link": "/footy/winners",
                },
                {
                    "label": "Points",
                    "link": "/footy/points",
                },
                {
                    "label": "Averages",
                    "link": "/footy/averages",
                },
                {
                    "label": "Stalwart Standings",
                    "link": "/footy/stalwart",
                },
                {
                    "label": "Captain Speedy",
                    "link": "/footy/speedy",
                },
                {
                    "label": "Pub",
                    "link": "/footy/pub",
                },
            ],
        },
        {
            "label": "Players",
            "initiallyOpened": true,
            "links": [
                {
                    "label": "Info",
                    "link": "/footy/info",
                },
                {
                    "label": "Player List",
                    "link": "/footy/players",
                },
                {
                    "label": "Turnout",
                    "link": "/footy/turnout",
                },
                {
                    "label": "Rules",
                    "link": "/footy/rules",
                },
            ],
        },
        {
            "label": "Admin",
            "initiallyOpened": true,
            "links": [
                {
                    "label": "Sign Up",
                    "link": "/footy/signup",
                },
                {
                    "label": "Sign In",
                    "link": "/footy/signin",
                },
                {
                    "label": "Users",
                    "link": "/footy/admin/users",
                },
            ],
        }
    ];

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links.map((item) => <NavbarLinksGroup {...item} key={item.label} />)}</div>
            </ScrollArea>

            <div className={classes.footer}>
            </div>
        </nav>
    );
};

export default NavbarNested;
