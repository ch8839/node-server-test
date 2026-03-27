import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Input, Row, Segmented, Space, Tag, Typography } from "antd";
import { Search } from "lucide-react";
import { materials } from "@/data/materials";
import styles from "./HomePage.module.scss";

const { Title, Paragraph, Text } = Typography;

function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [activeTag, setActiveTag] = useState<string>("全部");

  const categories = useMemo(() => {
    const values = Array.from(new Set(materials.map((item) => item.category)));
    return ["全部", ...values];
  }, []);

  const tags = useMemo(() => {
    const values = Array.from(new Set(materials.flatMap((item) => item.tags)));
    return ["全部", ...values];
  }, []);

  const filteredMaterials = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return materials.filter((item) => {
      const matchKeyword = !normalized || item.title.toLowerCase().includes(normalized);
      const matchCategory = activeCategory === "全部" || item.category === activeCategory;
      const matchTag = activeTag === "全部" || item.tags.includes(activeTag);
      return matchKeyword && matchCategory && matchTag;
    });
  }, [keyword, activeCategory, activeTag]);

  return (
    <Space direction="vertical" size={20} className={styles.root}>
      <div className={styles.searchWrap}>
        <Input
          size="large"
          placeholder="按标题搜索物料"
          prefix={<Search size={16} />}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          allowClear
        />
      </div>

      <Card className={styles.surfaceCard}>
        <Space direction="vertical" size={12} className={styles.fullWidth}>
          <Space wrap size={12} className={styles.filterHead}>
            <Text type="secondary">分类筛选</Text>
            <Button
              type="text"
              onClick={() => {
                setKeyword("");
                setActiveCategory("全部");
                setActiveTag("全部");
              }}
            >
              重置筛选
            </Button>
          </Space>
          <Segmented
            className={styles.segmented}
            options={categories}
            value={activeCategory}
            onChange={(value) => setActiveCategory(String(value))}
          />
          <Space wrap size={[8, 8]} className={styles.checkableTags}>
            {tags.map((tag) => (
              <Tag.CheckableTag
                key={tag}
                checked={activeTag === tag}
                onChange={() => setActiveTag(tag)}
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </Space>
        </Space>
      </Card>

      <Space direction="vertical" size={12} className={styles.fullWidth}>
        <Title level={4} className={styles.titleNoMargin}>
          物料总览
        </Title>
        <Text type="secondary">
          当前分类：{activeCategory}，标签：{activeTag}，结果 {filteredMaterials.length} 个
        </Text>
      </Space>

      <Row gutter={[16, 16]}>
        {filteredMaterials.map((item) => (
          <Col xs={24} md={12} lg={8} key={item.id}>
            <Link to={`/materials/${item.id}`} style={{ color: "inherit" }}>
              <Card className={`${styles.surfaceCard} ${styles.materialCard}`}>
                <Space direction="vertical" size={10} className={styles.fullWidth}>
                  <Space className={styles.cardHeader}>
                    <Title level={5} className={styles.titleNoMargin}>
                      {item.title}
                    </Title>
                    <Tag color="blue">{item.category}</Tag>
                  </Space>
                  <Paragraph type="secondary" className={styles.paragraphNoMargin}>
                    {item.description}
                  </Paragraph>
                  <Space wrap size={[6, 8]}>
                    {item.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {filteredMaterials.length === 0 && (
        <Card className={styles.surfaceCard}>
          <Paragraph type="secondary" className={styles.paragraphNoMargin}>
            没有找到匹配的物料，请尝试其他关键词。
          </Paragraph>
        </Card>
      )}
    </Space>
  );
}

export default HomePage;
