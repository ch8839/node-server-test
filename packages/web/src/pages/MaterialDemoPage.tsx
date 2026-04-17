import { type ComponentType, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Empty, Spin, Space, Typography, Skeleton } from 'antd';
import { getMaterialById } from '@/data/materials';
import styles from './MaterialDemoPage.module.scss';

const { Title, Paragraph } = Typography;
const demoLoaders = import.meta.glob('/src/materials/**/index.tsx');

function MaterialDemoPage() {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const material = useMemo(() => getMaterialById(materialId), [materialId]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [DemoComponent, setDemoComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDemo() {
      if (!material) {
        setError('未找到对应物料。');
        setDemoComponent(null);
        return;
      }

      setLoading(true);
      setError('');
      setDemoComponent(null);

      try {
        const key = `/src/materials/${material.demoPath}`;
        console.log('>>>demoLoaders', demoLoaders);
        const loader = demoLoaders[key] as (() => Promise<{ default: ComponentType }>) | undefined;
        if (!loader) throw new Error(`Demo not found: ${key}`);
        const module = await loader();
        console.log('>>>module', module);
        if (active) setDemoComponent(() => module.default);
      } catch {
        if (active) setError('演示组件加载失败，请检查 demoPath 配置。');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDemo();
    return () => {
      active = false;
    };
  }, [material]);

  const renderDemo = () => {
    if (loading) {
      return <Spin size="large" />;
    }
    if (error) {
      return <Alert type="error" message={error} showIcon />;
    }
    if (DemoComponent) return <DemoComponent />;
    return <Empty description="暂无演示内容" />;
  };

  if (!material) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (material.displayMode === 'full') {
    return <div className={styles.demoPage}>{renderDemo()}</div>;
  }

  return (
    <div className={styles.demoPage}>
      <div className={styles.demoToolbar}>
        <Button
          icon={<ArrowLeftOutlined />}
          size="large"
          onClick={() => navigate(`/materials/${materialId}`)}
        >
          返回详情
        </Button>
      </div>
      <Card className={styles.demoCanvas}>
        <Space direction="vertical" size={12} className={styles.fullWidth}>
          <Title level={3} className={styles.titleNoMargin}>
            {material?.title ?? 'Demo Preview'}
          </Title>
          <Paragraph type="secondary">全屏预览当前物料组件演示。</Paragraph>
          <div className={styles.demoStage}>{renderDemo()}</div>
        </Space>
      </Card>
    </div>
  );
}

export default MaterialDemoPage;
