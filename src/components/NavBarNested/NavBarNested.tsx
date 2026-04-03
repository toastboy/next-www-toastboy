"use client";

import { Box, ScrollArea } from '@mantine/core';

import { UserButton } from '@/components/UserButton/UserButton';
import { AuthUserSummary } from '@/types/AuthUser';

import { NavBarLinksGroup } from '../NavBarLinksGroup/NavBarLinksGroup';
import classes from './NavBarNested.module.css';

export interface Props {
    user?: AuthUserSummary | null;
}

export const NavBarNested = ({ user }: Props) => {
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
                {
                    "label": "Books",
                    "link": "/footy/books",
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
    ];
    const adminLinks = [
        {
            "label": "Admin",
            "initiallyOpened": true,
            "links": [
                {
                    "label": "Dashboard",
                    "link": "/footy/admin",
                },
                {
                    "label": "Drinkers",
                    "link": "/footy/admin/drinkers",
                },
                {
                    "label": "Invoice",
                    "link": "/footy/admin/invoice",
                },
                {
                    "label": "Money",
                    "link": "/footy/admin/money",
                },
                {
                    "label": "More Games",
                    "link": "/footy/admin/moregames",
                },
                {
                    "label": "New Game",
                    "link": "/footy/admin/newgame",
                },
                {
                    "label": "New Player",
                    "link": "/footy/admin/newplayer",
                },
                {
                    "label": "Picker",
                    "link": "/footy/admin/picker",
                },
                {
                    "label": "Players",
                    "link": "/footy/admin/players",
                },
                {
                    "label": "Responses",
                    "link": "/footy/admin/responses",
                },
                {
                    "label": "Users",
                    "link": "/footy/admin/users",
                },
            ],
        },
    ];

    return (
        <Box role="navigation" className={classes.navbar}>
            <Box className={classes.header} data-testid="navbar-header">
            </Box>

            <ScrollArea className={classes.links} data-testid="navbar-links">
                <Box className={classes.linksInner}>
                    {links.map((item) => <NavBarLinksGroup {...item} key={item.label} />)}
                </Box>
                {user?.role === 'admin' && (
                    <Box className={classes.linksInner}>
                        {adminLinks.map((item) => <NavBarLinksGroup {...item} key={item.label} />)}
                    </Box>
                )}
            </ScrollArea>

            <Box className={classes.footer} data-testid="navbar-footer">
                <UserButton user={user} />
            </Box>
        </Box>
    );
};
