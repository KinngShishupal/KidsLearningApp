import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, PanResponder } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Svg, { Path, Circle } from 'react-native-svg';

interface DrawingCanvasProps {
  onComplete?: () => void;
  color?: string;
}

interface Point {
  x: number;
  y: number;
}

export function DrawingCanvas({ onComplete, color = '#FF6B6B' }: DrawingCanvasProps) {
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [selectedColor, setSelectedColor] = useState(color);

  const colors = ['#FF6B6B', '#4ECDC4', '#56C596', '#FFD93D', '#A8E6CF', '#FF8E53'];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath([{ x: locationX, y: locationY }]);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath([...currentPath, { x: locationX, y: locationY }]);
    },
    onPanResponderRelease: () => {
      if (currentPath.length > 0) {
        setPaths([...paths, currentPath]);
        setCurrentPath([]);
      }
    },
  });

  const pathToSvgPath = (points: Point[]) => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Draw and Color!</ThemedText>
      
      <View style={styles.colorPicker}>
        {colors.map((col) => (
          <TouchableOpacity
            key={col}
            style={[
              styles.colorButton,
              { backgroundColor: col },
              selectedColor === col && styles.selectedColorButton,
            ]}
            onPress={() => setSelectedColor(col)}
          />
        ))}
      </View>

      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg width="100%" height="100%" style={styles.canvas}>
          {paths.map((path, index) => (
            <Path
              key={`path-${index}`}
              d={pathToSvgPath(path)}
              stroke={selectedColor}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath.length > 0 && (
            <Path
              d={pathToSvgPath(currentPath)}
              stroke={selectedColor}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
          <ThemedText style={styles.clearButtonText}>Clear</ThemedText>
        </TouchableOpacity>
        {onComplete && (
          <TouchableOpacity style={styles.doneButton} onPress={onComplete}>
            <ThemedText style={styles.doneButtonText}>Done!</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  selectedColorButton: {
    borderWidth: 4,
    borderColor: '#333',
    transform: [{ scale: 1.1 }],
  },
  canvasContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  canvas: {
    borderRadius: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
