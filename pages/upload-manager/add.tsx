import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Form, Button, Space, Collapsible, Toast, Typography, Notification } from '@douyinfe/semi-ui';
import { FormFCChild } from '@douyinfe/semi-ui/lib/es/form';
import { IconChevronDown, IconChevronUp } from '@douyinfe/semi-icons';
import {registerMediaQuery, responsiveMap } from '../../libs/utils'
import { addTemplate, sendRequest, StudioEntity } from '../../libs/api-streamer';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';
import TemplateFields from "../../components/TemplateFields";

export default function Add() {
    const { Text, Paragraph } = Typography;

    const { Section, Input, DatePicker, TimePicker, Select, Switch, InputNumber, Checkbox, CheckboxGroup, RadioGroup, Radio, Cascader, TagInput, TextArea } = Form;

    const [labelPosition, setLabelPosition] = useState<'top' | 'left' | 'inset'>('inset');
    useEffect(()=> {
        const unRegister = registerMediaQuery(responsiveMap.lg, {
            match: () => {
                setLabelPosition('left');
            },
            unmatch: () => {
                setLabelPosition('top');
            },
        })
        return () => unRegister();
    }, []);
    const { trigger } = useSWRMutation('/v1/upload/streamers', sendRequest);
    const router = useRouter();
    return (
        <main style={{
            padding: '24px',
            backgroundColor: 'var(--semi-color-bg-0)',
            display: 'flex',
            justifyContent: 'space-around',
        }}>
            <Form autoScrollToError onSubmit={async (values)=>{
                try {
                    // if(typeof values instanceof StudioEntity) {
                        const studioEntity: StudioEntity = {
                            template_name: values.template_name, 
                            copyright: values.copyright,
                            id: values.id,
                            source: values.source ?? '',
                            tid: values.tid[1],
                            cover: values.cover ?? '',
                            title: values.title ?? '',
                            desc: values.desc ?? '',
                            dynamic: values.dynamic ?? '',
                            tag: values.tag ?? '',
                            interactive: values.interactive ?? 0,
                            dolby: values.dolby ?? 0,
                            lossless_music: values.lossless_music ?? 0,
                            up_selection_reply: values.up_selection_reply ?? false,
                            up_close_reply: values.up_close_reply ?? false,
                            up_close_danmu: values.up_close_danmu ?? false,
                            open_elec: values.open_elec,
                            no_reprint: values.no_reprint,
                            mission_id: values.mission_id,
                            dtime: values.dtime
                        }
                        // const test: StudioEntity = Object.assign({template_name: 'a', copyright: 1}, values);
                        console.log(studioEntity);
                        
                        console.log(1111, typeof (values as unknown  as StudioEntity));
                    // }
                    
                    const result = await trigger(studioEntity);
                    
                    Toast.success('创建成功');
                    router.push('/upload-manager');
                }catch (e: any) {
                    // error handling
                    Notification.error({
                        title: '创建失败',
                        content: <Paragraph style={{maxWidth: 450}}>{e.message}</Paragraph>, 
                        // theme: 'light', 
                        // duration: 0,
                        style: {width: 'min-content'}
                    });
                }
                
            }} component={TemplateFields} labelWidth='180px' labelPosition={labelPosition}/>
        </main>
    );
}
