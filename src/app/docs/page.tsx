'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import styles from './page.module.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <p className={styles.loadingText}>Loading API docs…</p>
    </div>
  ),
});

export default function DocsPage() {
  return (
    <div className={styles.wrapper}>
      <SwaggerUI url="/api/docs" />
    </div>
  );
}
