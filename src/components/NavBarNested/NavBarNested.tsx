"use client";

import { ScrollArea } from '@mantine/core';
import NavbarLinksGroup from 'components/NavbarLinksGroup/NavbarLinksGroup';
import data from 'components/NavbarNested/NavbarNested.json';
import classes from 'components/NavbarNested/NavbarNested.module.css';
import UserButton from 'components/UserButton/UserButton';

const NavbarNested: React.FC = () => {
    const links = data.map((item) => <NavbarLinksGroup {...item} key={item.label} />);

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <UserButton />
            </div>
        </nav>
    );
};

export default NavbarNested;
