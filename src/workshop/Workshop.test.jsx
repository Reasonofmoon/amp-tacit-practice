import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
vi.mock('../LegacyApp',()=>({default:()=> <h1>보존된 이전 실습</h1>}));
beforeEach(()=>{window.location.hash='';localStorage.clear();});
afterEach(()=>cleanup());
describe('workshop routes and labs',()=>{
 it('defaults to real labs without quiz gates',()=>{render(<App/>);expect(screen.getByRole('heading',{level:1})).toHaveTextContent('실제로 만들어');expect(screen.getByRole('link',{name:/Pomelli 열기/})).toHaveAttribute('href','https://labs.google.com/u/0/pomelli/campaigns');expect(screen.queryByRole('checkbox')).toBeNull();expect(screen.getByRole('slider',{name:'SCREEN EFFECT'})).toHaveAttribute('max','5');});
 it('switches tabs with keys and lets participants edit a harness',()=>{render(<App/>);const tab=screen.getAllByRole('tab')[0];fireEvent.keyDown(tab,{key:'End'});expect(screen.getByRole('tab',{name:/반복을 구조로/})).toHaveAttribute('aria-selected','true');fireEvent.change(screen.getByLabelText('반복할 작업'),{target:{value:'월간 공개 자료 정리'}});fireEvent.click(screen.getByRole('button',{name:'설계 파일 미리보기'}));expect(screen.getByText(/# 하네스 설계: 월간 공개 자료 정리/)).toBeInTheDocument();});
 it('shows fictional notebook sources and empty actual outputs',()=>{render(<App/>);fireEvent.click(screen.getByRole('tab',{name:/자료를 생각으로/}));expect(screen.getByLabelText('가상 실습 자료').value).toContain('가상 실습 자료');expect(screen.getByLabelText('실제 결과 제목')).toHaveValue('');expect(screen.getByRole('link',{name:/Gemini Notebook 열기/})).toHaveAttribute('rel','noopener noreferrer');});
 it('routes explicitly to preserved legacy without clearing stored data',async()=>{localStorage.setItem('legacy-sentinel','keep');window.location.hash='#legacy';render(<App/>);expect(await screen.findByRole('heading',{name:'보존된 이전 실습'})).toBeInTheDocument();expect(localStorage.getItem('legacy-sentinel')).toBe('keep');expect(screen.getByRole('link',{name:'AMP 26 새 워크숍으로 돌아가기'})).toHaveAttribute('href','#workshop');});
});
