"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useState, useCallback, useEffect } from "react";
import { imageFileToDataUrl } from "@/lib/image-file";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  Undo, Redo, Code, Minus, Highlighter, Eye, FileCode,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const HEADING_OPTIONS = [
  { label: "ย่อหน้า", value: "paragraph" },
  { label: "หัวข้อ 1", value: "h1" },
  { label: "หัวข้อ 2", value: "h2" },
  { label: "หัวข้อ 3", value: "h3" },
  { label: "หัวข้อ 4", value: "h4" },
];

function ToolBtn({
  onClick,
  active = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-all flex-shrink-0 ${
        active
          ? "bg-primary text-white"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = "เขียนเนื้อหาที่นี่..." }: Props) {
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");
  const [rawHtml, setRawHtml] = useState(value ?? "");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[280px] px-5 py-4 focus:outline-none font-sans",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setRawHtml(html);
      onChange(html);
    },
    immediatelyRender: false,
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const setHeading = useCallback((val: string) => {
    if (!editor) return;
    if (val === "paragraph") editor.chain().focus().setParagraph().run();
    else {
      const level = parseInt(val.replace("h", "")) as 1 | 2 | 3 | 4;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }, [editor]);

  const getHeadingValue = () => {
    if (!editor) return "paragraph";
    for (let i = 1; i <= 4; i++) {
      if (editor.isActive("heading", { level: i })) return `h${i}`;
    }
    return "paragraph";
  };

  const addImage = () => {
    if (editor && imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setImageError("");
      setShowImageInput(false);
    }
  };

  async function addImageFile(file?: File) {
    if (!editor || !file) return;

    try {
      setImageError("");
      const dataUrl = await imageFileToDataUrl(file);
      editor.chain().focus().setImage({ src: dataUrl }).run();
      setShowImageInput(false);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Could not add this image.");
    }
  }

  const setLink = () => {
    if (!editor) return;
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const charCount = editor?.storage.characterCount?.characters() ?? 0;
  const wordCount = editor?.storage.characterCount?.words() ?? 0;

  if (!editor) return null;

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">

      {/* Top bar: media + tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-accent/30">
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          เพิ่มสื่อ
        </button>
        <div className="flex items-center gap-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={`px-3 py-1 rounded-lg transition-all ${activeTab === "visual" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />เสมือนจริง
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("code");
              setRawHtml(editor.getHTML());
            }}
            className={`px-3 py-1 rounded-lg transition-all ${activeTab === "code" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
          >
            <FileCode className="w-3.5 h-3.5 inline mr-1" />Code
          </button>
        </div>
      </div>

      {/* Image URL input */}
      {showImageInput && (
        <div className="space-y-2 px-4 py-3 border-b border-border bg-blue-50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => addImageFile(e.target.files?.[0])}
              className="flex-1 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
            />
            <span className="text-xs text-muted-foreground">or paste URL</span>
          </div>
          <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... (URL รูปภาพ)"
            className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
          />
          <button type="button" onClick={addImage} className="gradient-btn text-white text-xs font-bold px-3 py-1.5 rounded-lg">แทรก</button>
          <button type="button" onClick={() => setShowImageInput(false)} className="text-xs text-muted-foreground hover:text-foreground px-2">ยกเลิก</button>
          </div>
          {imageError && <p className="text-xs font-medium text-red-600">{imageError}</p>}
        </div>
      )}

      {/* Link URL input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-green-50">
          <LinkIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
          />
          <button type="button" onClick={setLink} className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">แทรก Link</button>
          <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }} className="text-xs text-red-500 hover:text-red-700 px-2">ลบ Link</button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="text-xs text-muted-foreground hover:text-foreground px-2">ยกเลิก</button>
        </div>
      )}

      {activeTab === "visual" ? (
        <>
          {/* Toolbar row 1 */}
          <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border bg-accent/20 flex-wrap">
            <select
              value={getHeadingValue()}
              onChange={(e) => setHeading(e.target.value)}
              className="text-xs border border-border rounded-lg px-2 py-1.5 mr-1 focus:outline-none focus:border-primary bg-card cursor-pointer"
            >
              {HEADING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
              <Bold className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
              <Italic className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
              <UnderlineIcon className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
              <Strikethrough className="w-3.5 h-3.5" />
            </ToolBtn>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="รายการหัวข้อ">
              <List className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="รายการตัวเลข">
              <ListOrdered className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
              <Quote className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Code">
              <Code className="w-3.5 h-3.5" />
            </ToolBtn>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="จัดซ้าย">
              <AlignLeft className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="จัดกลาง">
              <AlignCenter className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="จัดขวา">
              <AlignRight className="w-3.5 h-3.5" />
            </ToolBtn>

            <div className="w-px h-5 bg-border mx-1" />

            <ToolBtn onClick={() => setShowLinkInput(!showLinkInput)} active={editor.isActive("link")} title="แทรก Link">
              <LinkIcon className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={addTable} active={false} title="แทรกตาราง">
              <TableIcon className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="เส้นแบ่ง">
              <Minus className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
              <Highlighter className="w-3.5 h-3.5" />
            </ToolBtn>

            <div className="w-px h-5 bg-border mx-1 ml-auto" />

            <ToolBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo (Ctrl+Z)">
              <Undo className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo (Ctrl+Y)">
              <Redo className="w-3.5 h-3.5" />
            </ToolBtn>
          </div>

          {/* Editor area */}
          <div
            className="min-h-[320px] cursor-text"
            onClick={() => editor.commands.focus()}
          >
            <EditorContent editor={editor} />
          </div>
        </>
      ) : (
        /* Code view */
        <div className="relative">
          <div className="absolute top-2 right-3 text-xs text-muted-foreground font-mono">HTML</div>
          <textarea
            value={rawHtml}
            onChange={(e) => {
              setRawHtml(e.target.value);
              editor.commands.setContent(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full min-h-[360px] font-mono text-xs p-4 bg-gray-950 text-green-400 focus:outline-none resize-y"
            placeholder="<p>HTML content...</p>"
            spellCheck={false}
          />
        </div>
      )}

      {/* Footer: character count */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-accent/20 text-xs text-muted-foreground">
        <span>จำนวนอักขระ: <strong>{charCount.toLocaleString()}</strong></span>
        <span>คำ: <strong>{wordCount.toLocaleString()}</strong></span>
      </div>
    </div>
  );
}
