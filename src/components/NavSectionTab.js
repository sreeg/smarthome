import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Group, 
  ScrollArea, 
  UnstyledButton, 
  Text, 
  rem,
  useMantineTheme
} from '@mantine/core';

export default function NavSectionTab({ navConfig }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useMantineTheme();

  return (
    <ScrollArea scrollbars="x" type="never" pb="sm">
      <Group gap="sm" wrap="nowrap">
        {navConfig.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <UnstyledButton
              key={item.title}
              onClick={() => navigate(item.path)}
              px="md"
              py="xs"
              style={{
                borderRadius: theme.radius.md,
                backgroundColor: isActive ? 'var(--mantine-color-teal-filled)' : 'var(--mantine-color-gray-light)',
                color: isActive ? 'var(--mantine-color-white)' : 'inherit',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: isActive ? 'var(--mantine-color-teal-filled)' : 'var(--mantine-color-gray-1)',
                }
              }}
            >
              <Group gap="xs" wrap="nowrap">
                {item.icon}
                <Text size="sm" fw={600} style={{ textTransform: 'capitalize' }}>
                  {item.title}
                </Text>
              </Group>
            </UnstyledButton>
          );
        })}
      </Group>
    </ScrollArea>
  );
}
