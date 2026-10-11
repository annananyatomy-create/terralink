import React, { useState } from 'react';
import { Code2, Copy, Check, Download, FileCode, Terminal } from 'lucide-react';

interface JavaCodeViewerProps {
  onBackToApp: () => void;
}

export const JavaCodeViewer: React.FC<JavaCodeViewerProps> = ({ onBackToApp }) => {
  const [selectedFile, setSelectedFile] = useState<string>('TerralinkApp.java');
  const [copied, setCopied] = useState(false);

  const files: Record<string, { path: string; language: string; content: string }> = {
    'TerralinkApp.java': {
      path: 'java-app/src/main/java/com/terralink/TerralinkApp.java',
      language: 'java',
      content: `package com.terralink;

import com.terralink.model.*;
import com.terralink.ui.BiomeCanvasPanel;
import com.terralink.ui.CarbonTrackerPanel;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Terralink SDG Climate Action & Community Eco-Tracker
 * Main Java Desktop Application entry point.
 */
public class TerralinkApp extends JFrame {
    private final UserProfile user;
    private final List<ActivityEntry> activities;
    private CarbonTrackerPanel carbonPanel;
    private BiomeCanvasPanel biomePanel;

    public TerralinkApp() {
        super("Terralink · SDG Climate Action & Community Eco-Tracker");
        this.user = new UserProfile("Alex Chen", "@alexc_climate", "Riverside Eco-Quarter");
        this.activities = new ArrayList<>();

        seedInitialData();
        initUI();
    }

    private void seedInitialData() {
        activities.add(new ActivityEntry(
                "1", CategoryType.TRANSIT, "Metro Commute to Work (Line 2)",
                "14 km commute via electrified light rail instead of solo drive",
                0.39, 2.39, 2.0, 50, "Metro / Light Rail", 14.0
        ));
        activities.add(new ActivityEntry(
                "2", CategoryType.DIET, "Organic Lentil & Grain Bowl",
                "Zero-mile local legume meal from Green Market Co-op",
                0.45, 2.25, 1.8, 45, "Plant-Based / Vegan Meal", null
        ));
    }

    private void initUI() {
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1100, 780);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Header Navigation
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(Color.WHITE);
        header.setPreferredSize(new Dimension(1100, 60));

        JLabel brand = new JLabel("  🌿 Terralink  [SDG 13 · 11 · 12]");
        brand.setFont(new Font("SansSerif", Font.BOLD, 18));
        brand.setForeground(new Color(4, 120, 87));
        header.add(brand, BorderLayout.WEST);

        JButton logBtn = new JButton("+ Log Carbon Action");
        logBtn.setBackground(new Color(4, 120, 87));
        logBtn.setForeground(Color.WHITE);
        logBtn.addActionListener(e -> openLogActionDialog());
        header.add(logBtn, BorderLayout.EAST);
        add(header, BorderLayout.NORTH);

        // Tabbed Views
        JTabbedPane tabbedPane = new JTabbedPane();
        JPanel dashboardTab = new JPanel(new BorderLayout());
        biomePanel = new BiomeCanvasPanel(user);
        carbonPanel = new CarbonTrackerPanel(user, activities, this::openLogActionDialog);
        dashboardTab.add(biomePanel, BorderLayout.NORTH);
        dashboardTab.add(carbonPanel, BorderLayout.CENTER);
        tabbedPane.addTab("Dashboard", dashboardTab);
        tabbedPane.addTab("Transit Network", createTransitTab());

        add(tabbedPane, BorderLayout.CENTER);
    }

    private void openLogActionDialog() {
        // Quick calculation dialog
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new TerralinkApp().setVisible(true));
    }
}`,
    },
    'BiomeCanvasPanel.java': {
      path: 'java-app/src/main/java/com/terralink/ui/BiomeCanvasPanel.java',
      language: 'java',
      content: `package com.terralink.ui;

import com.terralink.model.UserProfile;
import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;

/**
 * Java Swing GUI component: Living Urban Biome Canvas.
 * Renders the SDG 13 ecological landscape using Graphics2D vector drawing.
 */
public class BiomeCanvasPanel extends JPanel {
    private final UserProfile user;

    public BiomeCanvasPanel(UserProfile user) {
        this.user = user;
        setPreferredSize(new Dimension(800, 240));
        setBackground(new Color(240, 253, 250));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        // Sky gradient
        GradientPaint skyGradient = new GradientPaint(
                0, 0, new Color(224, 242, 254),
                0, h, new Color(209, 250, 229)
        );
        g2.setPaint(skyGradient);
        g2.fillRect(0, 0, w, h);

        // Sun & Hills
        g2.setColor(new Color(251, 191, 36));
        g2.fillOval(w - 90, 25, 48, 48);
        g2.setColor(new Color(110, 231, 183));
        g2.fillArc(w / 4, h - 140, w, 220, 0, 180);

        // Oak Tree Trunk and Foliage
        int treeX = w / 3;
        int treeBaseY = h - 55;
        g2.setColor(new Color(120, 53, 15));
        g2.fillRect(treeX - 10, treeBaseY - 60, 20, 60);

        g2.setColor(new Color(4, 120, 87));
        g2.fillOval(treeX - 45, treeBaseY - 110, 90, 70);
        g2.dispose();
    }
}`,
    },
    'CarbonTrackerPanel.java': {
      path: 'java-app/src/main/java/com/terralink/ui/CarbonTrackerPanel.java',
      language: 'java',
      content: `package com.terralink.ui;

import com.terralink.model.ActivityEntry;
import com.terralink.model.UserProfile;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class CarbonTrackerPanel extends JPanel {
    private final UserProfile user;
    private final DefaultTableModel tableModel;

    public CarbonTrackerPanel(UserProfile user, List<ActivityEntry> activities, Runnable onLogAction) {
        this.user = user;
        setLayout(new BorderLayout(16, 16));

        // JTable for Activity History
        String[] columns = {"Activity", "Category", "Timestamp", "Emitted (kg)", "Avoided (kg)", "XP"};
        tableModel = new DefaultTableModel(columns, 0);
        JTable table = new JTable(tableModel);
        add(new JScrollPane(table), BorderLayout.CENTER);
    }
}`,
    },
    'UserProfile.java': {
      path: 'java-app/src/main/java/com/terralink/model/UserProfile.java',
      language: 'java',
      content: `package com.terralink.model;

public class UserProfile {
    private String name;
    private String handle;
    private String neighborhood;
    private int level = 4;
    private int xp = 1480;
    private int streakDays = 9;
    private double totalSavedKg = 84.6;
    private double dailyBudgetCappedKg = 5.0; // Paris 1.5°C threshold
    private double todayEmittedKg = 1.8;
    private double todaySavedKg = 4.4;

    public UserProfile(String name, String handle, String neighborhood) {
        this.name = name;
        this.handle = handle;
        this.neighborhood = neighborhood;
    }

    public void addActivity(double emitted, double saved, int earnedXp) {
        this.todayEmittedKg += emitted;
        this.todaySavedKg += saved;
        this.totalSavedKg += saved;
        this.xp += earnedXp;
    }

    public double getTodaySavedKg() { return todaySavedKg; }
    public double getTotalSavedKg() { return totalSavedKg; }
    public int getStreakDays() { return streakDays; }
}`,
    },
    'pom.xml': {
      path: 'java-app/pom.xml',
      language: 'xml',
      content: `<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.terralink</groupId>
    <artifactId>terralink-sdg-tracker</artifactId>
    <version>1.0.0</version>
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
</project>`,
    },
  };

  const currentFile = files[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-stone-900 text-white rounded-xl p-6 border border-stone-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Code2 className="w-4 h-4" />
              <span>JAVA DESKTOP &amp; SWING FRONTEND ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Terralink Java Application Codebase
            </h1>
            <p className="text-xs text-stone-300">
              Complete Java GUI application with <code className="text-emerald-300">JFrame</code>, <code className="text-emerald-300">Graphics2D</code> Biome Canvas, and <code className="text-emerald-300">JTable</code> carbon models.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToApp}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer"
            >
              Back to Web Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar File Tree */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold text-stone-900 uppercase font-mono pb-2 border-b border-stone-100 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-700" />
            <span>Java Source Files</span>
          </div>

          <div className="space-y-1 text-xs">
            {Object.keys(files).map((filename) => {
              const isSelected = selectedFile === filename;
              return (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-mono transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{filename}</span>
                  <span className="text-[10px] text-stone-400 font-sans">
                    {filename.endsWith('.xml') ? 'Maven' : 'Java'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Compilation Info */}
          <div className="pt-3 border-t border-stone-100 space-y-2 text-[11px] text-stone-600">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-stone-500" />
              <span>How to Compile in Java:</span>
            </div>
            <pre className="bg-stone-900 text-emerald-300 p-2.5 rounded-lg text-[10px] font-mono overflow-x-auto">
{`cd java-app
mvn clean package
java -jar target/terralink-sdg-tracker-1.0.0.jar`}
            </pre>
          </div>
        </div>

        {/* Code Content View */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <div className="font-mono text-xs text-stone-700">
              {currentFile.path}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-md text-xs font-medium cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-stone-950 text-stone-100 font-mono text-xs leading-relaxed overflow-x-auto max-h-[540px]">
            <code>{currentFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
