import React, { ReactNode } from 'react';
import { 
  StyleSheet, 
  View, 
  ViewStyle, 
  ScrollView, 
  ScrollViewProps,
  ViewProps
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, isWeb, BREAKPOINTS } from '../../constants/responsive';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';

interface PageContainerProps extends ScrollViewProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollable?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  scrollable = true,
  ...rest
}) => {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background },
    style,
  ];

  const MainView = scrollable ? ScrollView : View;
  const mainProps = scrollable ? rest : (rest as ViewProps);
  
  return (
    <SafeAreaView style={containerStyle}>
      <MainView 
        style={styles.innerContainer}
        {...mainProps}
        contentContainerStyle={[
          styles.content,
          contentContainerStyle
        ]}
      >
        <View style={styles.maxWidthWrapper}>
          {children}
        </View>
      </MainView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  maxWidthWrapper: {
    width: '100%',
    maxWidth: isWeb ? 850 : 768, // More focused content width on desktop for better readability
    paddingHorizontal: isWeb ? 40 : scale(20), // Generous padding on desktop
    alignSelf: 'center',
  },
});

export default PageContainer;
