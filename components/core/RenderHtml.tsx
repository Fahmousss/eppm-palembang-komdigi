'use client';

import { View, Text, Image, StyleSheet, useWindowDimensions, Linking } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { colors } from '~/lib/color';

interface RenderHtmlProps {
  html: string | Record<string, any>;
}

export default function RenderHtml({ html }: RenderHtmlProps) {
  const { width } = useWindowDimensions();
  const contentWidth = width - 40; // Account for padding

  // Custom renderers for HTML elements
  const renderers = {
    img: (props: any) => {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: props.src }} style={styles.image} resizeMode="cover" />
          {props.alt && <Text style={styles.imageCaption}>{props.alt}</Text>}
        </View>
      );
    },
  };

  // Custom tagsStyles for HTML elements
  const tagsStyles = {
    body: {
      fontFamily: 'System',
      fontSize: 16,
      lineHeight: 24,
      color: '#333333',
    },
    p: {
      marginBottom: 16,
    },
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 12,
      color: '#111111',
    },
    h2: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 10,
      color: '#111111',
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 8,
      color: '#111111',
    },
    h4: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 8,
      color: '#111111',
    },
    a: {
      color: colors.primary,
      textDecorationLine: 'none',
    },
    ul: {
      marginBottom: 16,
    },
    ol: {
      marginBottom: 16,
    },
    li: {
      marginBottom: 8,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      paddingLeft: 16,
      marginVertical: 16,
      fontStyle: 'italic',
    },
  };

  return (
    <RenderHTML
      contentWidth={contentWidth}
      source={{ html }}
      tagsStyles={tagsStyles}
      renderers={renderers}
      defaultTextProps={{
        selectable: true,
      }}
      renderersProps={{
        a: {
          onPress(event, href, htmlAttribs, target) {
            Linking.openURL(href);
            return false; // Prevent default handling
          },
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  imageCaption: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 8,
  },
});
