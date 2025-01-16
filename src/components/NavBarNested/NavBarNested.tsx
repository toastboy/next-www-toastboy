"use client";

import { Box, ScrollArea } from '@mantine/core';
import NavbarLinksGroup from 'components/NavbarLinksGroup/NavbarLinksGroup';
import UserButton from 'components/UserButton/UserButton';
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
                    "link": "/footy/auth/signup",
                },
                {
                    "label": "Sign In",
                    "link": "/footy/auth/signin",
                },
                {
                    "label": "Users",
                    "link": "/footy/admin/users",
                },
            ],
        }
    ];

    return (
        <Box role="navigation" className={classes.navbar}>
            <Box className={classes.header}>
            </Box>

            <ScrollArea className={classes.links}>
                <Box className={classes.linksInner}>
                    {links.map((item) => <NavbarLinksGroup {...item} key={item.label} />)}
                </Box>
            </ScrollArea>

            <Box className={classes.footer}>
                <UserButton />
            </Box>
        </Box>
    );
};

export default NavbarNested;
