import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Button, Card, Skeleton, Space, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import { getMaterialById } from "@/data/materials";
import styles from "./MaterialDetailPage.module.scss";

const { Title, Text } = Typography;
const readmeLoaders = import.meta.glob("/src/materials/**/README.md", {
  query: "?raw",
  import: "default",
});

function MaterialDetailPage() {
  const { materialId } = useParams();
  const material = useMemo(() => getMaterialById(materialId), [materialId]);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReadme() {
      if (!material) {
        setError("未找到该物料。");
        setMarkdown("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const key = `/src/materials/${material.readmePath}`;
        const loader = readmeLoaders[key] as (() => Promise<string>) | undefined;
        if (!loader) throw new Error(`README not found: ${key}`);
        const content = await loader();
        if (active) setMarkdown(content);
      } catch {
        if (active) {
          setError("README 加载失败，请检查物料配置路径。");
          setMarkdown("");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadReadme();
    return () => {
      active = false;
    };
  }, [material]);

  return (
    <Space direction="vertical" size={20} className={styles.root}>
      <Card className={styles.surfaceCard}>
        <div className={styles.detailHeader}>
          <div>
            <Title level={3} className={styles.title}>
              {material?.title ?? materialId ?? "unknown-material"}
            </Title>
            <Text type="secondary">{material?.description ?? "未匹配到该物料信息"}</Text>
          </div>
          <Space>
            <Link to="/">
              <Button size="large">返回首页</Button>
            </Link>
            <Link to={`/materials/${materialId}/demo`}>
              <Button type="primary" size="large" disabled={!material}>
                查看演示 (Live Demo)
              </Button>
            </Link>
          </Space>
        </div>
      </Card>

      <Card className={`${styles.surfaceCard} ${styles.markdownShell}`}>
        {loading && <Skeleton active paragraph={{ rows: 8 }} />}
        {!loading && error && <Alert type="error" message={error} showIcon />}
        {!loading && !error && (
          <article className={styles.markdownBody}>
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </article>
        )}
      </Card>
    </Space>
  );
}

export default MaterialDetailPage;
