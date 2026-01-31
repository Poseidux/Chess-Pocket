
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from 'react-native';
import { validateAllPuzzles, ValidationReport } from '@/utils/puzzleValidator';
import { BUILT_IN_PUZZLES } from '@/data/builtInPuzzles';

interface DebugPanelProps {
  visible: boolean;
  onClose: () => void;
}

export function DebugPanel({ visible, onClose }: DebugPanelProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(false);

  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    success: '#10b981',
    error: '#ef4444',
  };

  useEffect(() => {
    if (visible && !report) {
      runValidation();
    }
  }, [visible]);

  const runValidation = () => {
    console.log('DebugPanel: Running validation');
    setLoading(true);
    
    setTimeout(() => {
      const validationReport = validateAllPuzzles(BUILT_IN_PUZZLES);
      setReport(validationReport);
      setLoading(false);
    }, 100);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Debug Panel</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Running validation...
              </Text>
            </View>
          )}

          {report && (
            <>
              {/* Self-Test Results */}
              <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Chess Engine Self-Test</Text>
                {report.selfTest.passed ? (
                  <Text style={[styles.passText, { color: colors.success }]}>✓ All tests passed</Text>
                ) : (
                  <>
                    <Text style={[styles.failText, { color: colors.error }]}>✗ Tests failed</Text>
                    {report.selfTest.errors.map((error, idx) => (
                      <Text key={idx} style={[styles.errorText, { color: colors.error }]}>
                        {error}
                      </Text>
                    ))}
                  </>
                )}
              </View>

              {/* Validation Summary */}
              <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Puzzle Validation</Text>
                <Text style={[styles.summaryText, { color: colors.text }]}>
                  Total: {report.totalPuzzles}
                </Text>
                <Text style={[styles.summaryText, { color: colors.success }]}>
                  Passed: {report.passedPuzzles}
                </Text>
                <Text style={[styles.summaryText, { color: colors.error }]}>
                  Failed: {report.failedPuzzles.length}
                </Text>
              </View>

              {/* Failed Puzzles */}
              {report.failedPuzzles.length > 0 && (
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Failed Puzzles</Text>
                  {report.failedPuzzles.map((failure, idx) => (
                    <View key={idx} style={[styles.failureCard, { borderColor: colors.border }]}>
                      <Text style={[styles.failureId, { color: colors.error }]}>
                        {failure.puzzleId}
                      </Text>
                      {failure.errors.map((error, errorIdx) => (
                        <Text key={errorIdx} style={[styles.failureError, { color: colors.textSecondary }]}>
                          • {error}
                        </Text>
                      ))}
                      {failure.failingMoveIndex !== undefined && (
                        <>
                          <Text style={[styles.failureDetail, { color: colors.textSecondary }]}>
                            Move index: {failure.failingMoveIndex}
                          </Text>
                          {failure.failingMoveFrom && (
                            <Text style={[styles.failureDetail, { color: colors.textSecondary }]}>
                              From: [{failure.failingMoveFrom[0]}, {failure.failingMoveFrom[1]}]
                            </Text>
                          )}
                          {failure.failingMoveTo && (
                            <Text style={[styles.failureDetail, { color: colors.textSecondary }]}>
                              To: [{failure.failingMoveTo[0]}, {failure.failingMoveTo[1]}]
                            </Text>
                          )}
                          {failure.failingMoveLegalMoves && failure.failingMoveLegalMoves.length > 0 && (
                            <Text style={[styles.failureDetail, { color: colors.textSecondary }]}>
                              Legal moves from that square: {failure.failingMoveLegalMoves.length}
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[styles.rerunButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={runValidation}
              >
                <Text style={[styles.rerunButtonText, { color: colors.text }]}>Rerun Validation</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  passText: {
    fontSize: 16,
    fontWeight: '600',
  },
  failText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
  },
  failureCard: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  failureId: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  failureError: {
    fontSize: 14,
    marginBottom: 4,
  },
  failureDetail: {
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  rerunButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 8,
  },
  rerunButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
