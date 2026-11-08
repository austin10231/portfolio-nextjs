import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return <SiteShell><section className="section not-found"><h1>404</h1><p>This page could not be found. / 未找到此页面。</p><Link className="btn btn--outline" href="/">Back to Home / 返回首页</Link></section></SiteShell>;
}
