package com.thesis_formatter.thesis_formatter.utils;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;

import java.util.ArrayList;
import java.util.List;

public class HtmlToStyledTextParser {

    // Prevent instantiation
    private HtmlToStyledTextParser() {
    }

    public static class StyledText {
        public String text;
        public boolean bold = false;
        public boolean italic = false;

        public StyledText(String text, boolean bold, boolean italic) {
            this.text = text;
            this.bold = bold;
            this.italic = italic;
        }
    }

    public enum ListType {NONE, UL, OL}

    public static List<StyledText> parseHtml(String html) {
        Element body = Jsoup.parse(html).body();
        List<StyledText> result = new ArrayList<>();
        traverse(body, false, false, result, ListType.NONE, 0);
        return result;
    }

    private static void traverse(Node node, boolean isBold, boolean isItalic,
                                 List<StyledText> result, ListType currentListType, int itemIndex) {

        if (node instanceof TextNode) {
            String text = ((TextNode) node).text();
            if (!text.trim().isEmpty()) {
                result.add(new StyledText(text, isBold, isItalic));
            }
        }

        for (Node child : node.childNodes()) {
            boolean bold = isBold || child.nodeName().equalsIgnoreCase("strong") || child.nodeName().equalsIgnoreCase("b");
            boolean italic = isItalic || child.nodeName().equalsIgnoreCase("em") || child.nodeName().equalsIgnoreCase("i");

            switch (child.nodeName().toLowerCase()) {
                case "ol":
                    int olIndex = 0;
                    for (Node olChild : child.childNodes()) {
                        if (olChild.nodeName().equalsIgnoreCase("li")) {
                            String prefix = (olIndex + 1) + ". ";
                            result.add(new StyledText("\n" + prefix, false, false));
                            traverse(olChild, bold, italic, result, ListType.OL, olIndex + 1);
                            olIndex++;
                        } else {
                            traverse(olChild, bold, italic, result, ListType.OL, olIndex);
                        }
                    }
                    break;
                case "ul":
                    for (Node ulChild : child.childNodes()) {
                        if (ulChild.nodeName().equalsIgnoreCase("li")) {
                            result.add(new StyledText("\n• ", false, false));
                            traverse(ulChild, bold, italic, result, ListType.UL, 0);
                        } else {
                            traverse(ulChild, bold, italic, result, ListType.UL, 0);
                        }
                    }
                    break;

                default:
                    traverse(child, bold, italic, result, currentListType, itemIndex);
            }
        }
    }

    // ✅ StyledTable is nested here
    public static class StyledTable {
        public String title;  // ✅ optional table title
        public List<List<List<StyledText>>> rows = new ArrayList<>();
        // rows -> row -> cell -> styled text parts
    }

    // ✅ Table parsing reuses traverse()
    public static StyledTable parseHtmlTable(String html) {
        StyledTable styledTable = new StyledTable();

        // --- Step 1: extract title if exists ---
        String title = null;
        String tableHtml = html;
        int sepIndex = html.indexOf(":::");
        if (sepIndex != -1) {
            title = html.substring(0, sepIndex).trim();
            tableHtml = html.substring(sepIndex + 3); // rest after ':::'
        }
        styledTable.title = title;

        // --- Step 2: parse the table HTML ---
        Element body = Jsoup.parse(tableHtml).body();
        Element table = body.selectFirst("table");
        if (table == null) return styledTable; // return with only title if no table

        for (Element row : table.select("tr")) {
            List<List<StyledText>> styledRow = new ArrayList<>();
            for (Element cell : row.select("th, td")) {
                List<StyledText> cellTexts = new ArrayList<>();
                traverse(cell, false, false, cellTexts, ListType.NONE, 0);
                styledRow.add(cellTexts);
            }
            styledTable.rows.add(styledRow);
        }

        return styledTable;
    }


//    public static void printStyledTable(StyledTable styledTable) {
//        if (styledTable == null) {
//            System.out.println("❌ No table found.");
//            return;
//        }
//
//        int rowIndex = 0;
//        for (List<List<StyledText>> row : styledTable.rows) {
//            System.out.println("Row " + rowIndex + ":");
//            int colIndex = 0;
//            for (List<StyledText> cell : row) {
//                System.out.print("  Cell " + colIndex + ": ");
//                for (StyledText st : cell) {
//                    String flags = "";
//                    if (st.bold) flags += "[B]";
//                    if (st.italic) flags += "[I]";
//                    System.out.print(flags + st.text + " ");
//                }
//                System.out.println();
//                colIndex++;
//            }
//            rowIndex++;
//        }
//    }

}
