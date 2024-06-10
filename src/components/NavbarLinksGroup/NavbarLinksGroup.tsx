import { Box, Collapse, Group, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from 'components/NavbarLinksGroup/NavbarLinksGroup.module.css';
import Link from 'next/link';
import { useState } from 'react';

interface NavBarLinksGroupProps {
    label: string;
    initiallyOpened?: boolean;
    links?: { label: string; link: string }[];
}

const NavBarLinksGroup: React.FC<NavBarLinksGroupProps> = ({ label, initiallyOpened, links }) => {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const items = (hasLinks ? links : []).map((link) => (
        <Link className={classes.link} href={link.link} key={link.label}>
            {link.label}
        </Link>
    ));

    return (
        <>
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <Box ml="md">{label}</Box>
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={1.5}
                            style={{
                                width: rem(16),
                                height: rem(16),
                                transform: opened ? 'rotate(-90deg)' : 'none',
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse data-testid="collapse" in={opened}>{items}</Collapse> : null}
        </>
    );
};

export default NavBarLinksGroup;
