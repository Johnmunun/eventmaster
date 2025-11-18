module.exports = [
"[project]/lib/stores/qr-template-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useQRTemplateStore",
    ()=>useQRTemplateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const defaultGlobalConfig = {
    primaryColor: '#527AC9',
    secondaryColor: '#8B5CF6',
    backgroundColor: null,
    coverImage: null,
    logo: null,
    typography: 'sans',
    borderRadius: 'medium',
    fontWeight: 'normal',
    imageBorderStyle: 'shadow',
    imageBorderWidth: 2,
    imageBorderColor: '#E5E7EB',
    imageBorderRadius: 'medium'
};
const useQRTemplateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        selectedTemplate: null,
        globalConfig: defaultGlobalConfig,
        templateData: {},
        setSelectedTemplate: (template)=>{
            set({
                selectedTemplate: template,
                templateData: {}
            });
        },
        updateGlobalConfig: (config)=>{
            set((state)=>({
                    globalConfig: {
                        ...state.globalConfig,
                        ...config
                    }
                }));
        },
        updateTemplateData: (data)=>{
            set((state)=>({
                    templateData: {
                        ...state.templateData,
                        ...data
                    }
                }));
        },
        reset: ()=>{
            set({
                selectedTemplate: null,
                globalConfig: defaultGlobalConfig,
                templateData: {}
            });
        },
        exportToJSON: ()=>{
            const state = get();
            return {
                type: state.selectedTemplate,
                globalConfig: state.globalConfig,
                templateData: state.templateData,
                createdAt: new Date().toISOString()
            };
        }
    }));
}),
];

//# sourceMappingURL=lib_stores_qr-template-store_ts_eb0740ed._.js.map